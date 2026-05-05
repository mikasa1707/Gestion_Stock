import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  MouvementStock,
  TypeMouvementStock,
} from './entities/mouvement-stock.entity';

import { Article } from '../articles/entities/article.entity';
import { FicheTechnique } from '../fiches-techniques/entities/fiche-technique.entity';
import { LieuStockage } from '../stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from '../stockage/entities/zone-stockage.entity';
import { Unite } from '../unites/entities/unite.entity';
import { CompositionFicheTechnique } from '../fiches-techniques/entities/composition-fiche-technique.entity';

import { CreateMouvementDto } from './dto/create-mouvement.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(MouvementStock)
    private readonly mouvementRepo: Repository<MouvementStock>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(FicheTechnique)
    private readonly ficheRepo: Repository<FicheTechnique>,

    @InjectRepository(LieuStockage)
    private readonly lieuRepo: Repository<LieuStockage>,

    @InjectRepository(ZoneStockage)
    private readonly zoneRepo: Repository<ZoneStockage>,

    @InjectRepository(Unite)
    private readonly uniteRepo: Repository<Unite>,

    @InjectRepository(CompositionFicheTechnique)
    private readonly compositionRepo: Repository<CompositionFicheTechnique>,
  ) {}

  async mouvement(dto: CreateMouvementDto) {
    if (!dto.articleId && !dto.ficheTechniqueId) {
      throw new BadRequestException(
        'Mouvement doit concerner un article ou une fiche technique',
      );
    }

    if (dto.articleId && dto.ficheTechniqueId) {
      throw new BadRequestException(
        'Choisir soit article, soit fiche technique, pas les deux',
      );
    }

    const article = dto.articleId
      ? await this.findArticle(dto.articleId)
      : null;
    const ficheTechnique = dto.ficheTechniqueId
      ? await this.findFiche(dto.ficheTechniqueId)
      : null;

    const lieuStockage = await this.findLieu(dto.lieuStockageId);
    const zoneStockage = await this.findZone(dto.zoneStockageId);
    const uniteMouvement = await this.findUnite(dto.uniteId);

    const uniteReference = article?.unite ?? ficheTechnique?.unite;

    if (!uniteReference) {
      throw new BadRequestException('Unité de référence introuvable');
    }

    const quantiteReference = this.convertirQuantite(
      Number(dto.quantite),
      uniteMouvement,
      uniteReference,
    );

    // let stock = await this.stockRepo.findOne({
    //   where: {
    //     article: article ? { id: article.id } : undefined,
    //     ficheTechnique: ficheTechnique ? { id: ficheTechnique.id } : undefined,
    //     lieuStockage: { id: lieuStockage.id },
    //     zoneStockage: { id: zoneStockage.id },
    //   },
    //   relations: ['article', 'ficheTechnique', 'lieuStockage', 'zoneStockage'],
    // });

    // if (!stock) {
    //   stock = this.stockRepo.create({
    //     article,
    //     ficheTechnique,
    //     lieuStockage,
    //     zoneStockage,
    //     quantite: 0,
    //   });
    // }

    // const quantiteActuelle = Number(stock.quantite || 0);

    // if (dto.typeMouvement === TypeMouvementStock.ENTREE) {
    //   stock.quantite = quantiteActuelle + quantiteReference;
    // }

    // if (dto.typeMouvement === TypeMouvementStock.SORTIE) {
    //   if (quantiteActuelle < quantiteReference) {
    //     throw new BadRequestException('Stock insuffisant');
    //   }

    //   stock.quantite = quantiteActuelle - quantiteReference;
    // }

    // if (dto.typeMouvement === TypeMouvementStock.INVENTAIRE) {
    //   stock.quantite = quantiteReference;
    // }

    // const savedStock = await this.stockRepo.save(stock);

    const mouvement = this.mouvementRepo.create({
      typeMouvement: dto.typeMouvement,
      article,
      ficheTechnique,
      lieuStockage,
      zoneStockage,

      quantite: Number(dto.quantite),
      unite: uniteMouvement,

      quantiteReference,
      uniteReference,

      commentaire: dto.commentaire ?? null,
    });

    const savedMouvement = await this.mouvementRepo.save(mouvement);

    return {
      message: 'Mouvement enregistré',
      // stock: savedStock,
      mouvement: savedMouvement,
    };
  }

  findAllMouvements() {
    return this.mouvementRepo.find({
      relations: [
        'article',
        'ficheTechnique',
        'lieuStockage',
        'zoneStockage',
        'unite',
        'uniteReference',
      ],
      order: { id: 'DESC' },
    });
  }

  private async findArticle(id: number) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['unite'],
    });

    if (!article) {
      throw new NotFoundException('Article introuvable');
    }

    return article;
  }

  private async findFiche(id: number) {
    const fiche = await this.ficheRepo.findOne({
      where: { id },
      relations: ['unite'],
    });

    if (!fiche) {
      throw new NotFoundException('Fiche technique introuvable');
    }

    return fiche;
  }

  private async findLieu(id: number) {
    const lieu = await this.lieuRepo.findOne({ where: { id } });

    if (!lieu) {
      throw new NotFoundException('Lieu de stockage introuvable');
    }

    return lieu;
  }

  private async findZone(id: number) {
    const zone = await this.zoneRepo.findOne({ where: { id } });

    if (!zone) {
      throw new NotFoundException('Zone de stockage introuvable');
    }

    return zone;
  }

  private async findUnite(id: number) {
    const unite = await this.uniteRepo.findOne({ where: { id } });

    if (!unite) {
      throw new NotFoundException('Unité introuvable');
    }

    return unite;
  }

  private convertirQuantite(
    quantite: number,
    uniteSource: Unite,
    uniteReference: Unite,
  ): number {
    const facteurSource = Number(uniteSource.facteurReference || 1);
    const facteurReference = Number(uniteReference.facteurReference || 1);

    return (quantite * facteurSource) / facteurReference;
  }

  async getStockArticle(articleId: number) {
    const mouvements = await this.mouvementRepo.find({
      where: { article: { id: articleId } },
      relations: ['article', 'uniteReference'],
      order: { id: 'ASC' },
    });

    let total = 0;

    for (const m of mouvements) {
      const qte = Number(m.quantiteReference || 0);

      if (m.typeMouvement === TypeMouvementStock.ENTREE) {
        total += qte;
      }

      if (m.typeMouvement === TypeMouvementStock.SORTIE) {
        total -= qte;
      }

      if (m.typeMouvement === TypeMouvementStock.INVENTAIRE) {
        total = qte;
      }
    }

    return {
      articleId,
      stock: total,
      unite: mouvements[0]?.uniteReference ?? null,
    };
  }

  async sortieFicheTechnique(
    ficheTechniqueId: number,
    quantiteFtVendue: number,
    lieuStockageId: number,
    zoneStockageId: number,
  ) {
    const compositions = await this.compositionRepo.find({
      where: {
        ficheTechnique: { id: ficheTechniqueId },
      },
      relations: [
        'article',
        'ficheTechniqueComposant',
        'conditionnementUtilisation',
        'conditionnementUtilisation.unite',
      ],
    });

    if (!compositions.length) {
      throw new BadRequestException(
        'Cette fiche technique n’a aucune composition',
      );
    }

    const mouvements: any[] = [];

    for (const ligne of compositions) {
      if (ligne.article) {
        const quantiteSortie =
          Number(ligne.quantite || 1) *
          Number(ligne.conditionnementUtilisation.quantite || 1) *
          Number(quantiteFtVendue || 1);

        const mouvement = await this.mouvement({
          typeMouvement: TypeMouvementStock.SORTIE,
          articleId: ligne.article.id,
          lieuStockageId,
          zoneStockageId,
          quantite: quantiteSortie,
          uniteId: ligne.conditionnementUtilisation.unite.id,
          commentaire: `Sortie auto via FT #${ficheTechniqueId}`,
        });

        mouvements.push(mouvement);
      }

      if (ligne.ficheTechniqueComposant) {
        const sousSortie = await this.sortieFicheTechnique(
          ligne.ficheTechniqueComposant.id,
          Number(ligne.quantite || 1) * Number(quantiteFtVendue || 1),
          lieuStockageId,
          zoneStockageId,
        );

        mouvements.push(sousSortie);
      }
    }

    return {
      message: 'Sortie FT effectuée',
      ficheTechniqueId,
      quantiteFtVendue,
      mouvements,
    };
  }
}

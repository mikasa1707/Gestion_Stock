import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Achat } from './entities/achat.entity';
import { AchatLigne } from './entities/achat-ligne.entity';
import { CreateAchatDto } from './dto/create-achat.dto';

import { Article } from '../articles/entities/article.entity';
import { Unite } from '../unites/entities/unite.entity';
import { StockService } from '../stock/stock.service';
import { TypeMouvementStock } from '../stock/entities/mouvement-stock.entity';
import { ArticleFournisseur } from '../article-fournisseurs/entities/article-fournisseur.entity';
import { Fournisseur } from '../fournisseurs/entities/fournisseur.entity';

@Injectable()
export class AchatsService {
  constructor(
    @InjectRepository(Achat)
    private readonly achatRepo: Repository<Achat>,

    @InjectRepository(AchatLigne)
    private readonly ligneRepo: Repository<AchatLigne>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(Unite)
    private readonly uniteRepo: Repository<Unite>,

    @InjectRepository(ArticleFournisseur)
    private readonly articleFournisseurRepo: Repository<ArticleFournisseur>,

    @InjectRepository(Fournisseur)
    private readonly fournisseurRepo: Repository<Fournisseur>,

    private readonly stockService: StockService,
  ) {}

  async create(dto: CreateAchatDto) {
    if (!dto.lignes?.length) {
      throw new BadRequestException(
        'Un achat doit contenir au moins une ligne',
      );
    }

    const fournisseur = dto.fournisseurId
      ? await this.fournisseurRepo.findOne({
          where: { id: dto.fournisseurId },
        })
      : null;

    const achat = this.achatRepo.create({
      reference: dto.reference,
      date: dto.date,
      fournisseur: fournisseur?.nom ?? '',
      commentaire: dto.commentaire ?? null,
      montantTotal: 0,
    });

    const savedAchat = await this.achatRepo.save(achat);

    let montantTotal = 0;
    const lignes: AchatLigne[] = [];

    for (const l of dto.lignes) {
      const article = await this.findArticle(l.articleId);

      const articleFournisseur = l.articleFournisseurId
        ? await this.articleFournisseurRepo.findOne({
            where: { id: l.articleFournisseurId },
            relations: ['fournisseur', 'unite'],
          })
        : null;

      const unite =
        articleFournisseur?.unite ?? (await this.findUnite(l.uniteId));
      const prixUnitaire = Number(
        articleFournisseur?.prixAchat ?? l.prixUnitaire,
      );
      const quantite = Number(l.quantite);
      const montant = quantite * prixUnitaire;

      montantTotal += montant;

      const ligne = this.ligneRepo.create({
        achat: savedAchat,
        article,
        unite,
        quantite,
        prixUnitaire,
        montant,
      });

      lignes.push(await this.ligneRepo.save(ligne));

      await this.stockService.mouvement({
        typeMouvement: TypeMouvementStock.ENTREE,
        articleId: article.id,
        quantite,
        uniteId: unite.id,
        lieuStockageId: 1,
        zoneStockageId: 1,
        commentaire: `Achat ${savedAchat.reference}`,
      });
    }

    savedAchat.montantTotal = montantTotal;
    await this.achatRepo.save(savedAchat);

    return this.findOne(savedAchat.id);
  }

  findAll() {
    return this.achatRepo.find({
      relations: ['lignes', 'lignes.article', 'lignes.unite'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const achat = await this.achatRepo.findOne({
      where: { id },
      relations: ['lignes', 'lignes.article', 'lignes.unite'],
    });

    if (!achat) {
      throw new NotFoundException('Achat introuvable');
    }

    return achat;
  }

  async remove(id: number) {
    const achat = await this.findOne(id);
    await this.achatRepo.remove(achat);

    return {
      message: 'Achat supprimé',
      id,
    };
  }

  private async findArticle(id: number) {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['unite'],
    });

    if (!article) throw new NotFoundException('Article introuvable');

    return article;
  }

  private async findUnite(id: number) {
    const unite = await this.uniteRepo.findOne({ where: { id } });

    if (!unite) throw new NotFoundException('Unité introuvable');

    return unite;
  }
}

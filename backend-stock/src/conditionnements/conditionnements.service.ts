import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conditionnement } from './entities/conditionnement.entity';
import { Unite } from '../unites/entities/unite.entity';
import { CreateConditionnementDto } from './dto/create-conditionnement.dto';
import { UpdateConditionnementDto } from './dto/update-conditionnement.dto';

import { BadRequestException } from '@nestjs/common';
import { ConditionnementProduit } from './entities/conditionnement-produit.entity';
import { Article } from '../articles/entities/article.entity';
import { FicheTechnique } from '../fiches-techniques/entities/fiche-technique.entity';
import { CreateConditionnementProduitDto } from './dto/create-conditionnement-produit.dto';
import { UpdateConditionnementProduitDto } from './dto/update-conditionnement-produit.dto';
import { ConditionnementUtilisation } from './entities/conditionnement-utilisation.entity';
import { CreateConditionnementUtilisationDto } from './dto/create-conditionnement-utilisation.dto';

@Injectable()
export class ConditionnementsService {
  constructor(
    @InjectRepository(Conditionnement)
    private readonly repo: Repository<Conditionnement>,

    @InjectRepository(Unite)
    private readonly uniteRepo: Repository<Unite>,

    @InjectRepository(ConditionnementProduit)
    private readonly conditionnementProduitRepo: Repository<ConditionnementProduit>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(FicheTechnique)
    private readonly ficheRepo: Repository<FicheTechnique>,

    @InjectRepository(ConditionnementUtilisation)
    private readonly utilisationRepo: Repository<ConditionnementUtilisation>,
  ) {}

  async create(dto: CreateConditionnementDto) {
    const unite = await this.findUnite(dto.uniteId);

    const conditionnement = this.repo.create({
      nom: dto.nom,
      quantite: dto.quantite,
      unite,
      type: dto.type,
      actif: dto.actif ?? true,
    });

    return this.repo.save(conditionnement);
  }

  findAll() {
    return this.repo.find({
      relations: ['unite'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const conditionnement = await this.repo.findOne({
      where: { id },
      relations: ['unite'],
    });

    if (!conditionnement) {
      throw new NotFoundException('Conditionnement introuvable');
    }

    return conditionnement;
  }

  async update(id: number, dto: UpdateConditionnementDto) {
    const conditionnement = await this.findOne(id);

    if (dto.nom !== undefined) conditionnement.nom = dto.nom;
    if (dto.quantite !== undefined) conditionnement.quantite = dto.quantite;
    if (dto.type !== undefined) conditionnement.type = dto.type;
    if (dto.actif !== undefined) conditionnement.actif = dto.actif;

    if (dto.uniteId !== undefined) {
      conditionnement.unite = await this.findUnite(dto.uniteId);
    }

    return this.repo.save(conditionnement);
  }

  async remove(id: number) {
    const conditionnement = await this.findOne(id);
    await this.repo.remove(conditionnement);

    return {
      message: 'Conditionnement supprimé',
      id,
    };
  }

  private async findUnite(id: number) {
    const unite = await this.uniteRepo.findOne({ where: { id } });

    if (!unite) {
      throw new NotFoundException('Unité introuvable');
    }

    return unite;
  }

  async createProduit(dto: CreateConditionnementProduitDto) {
    if (!dto.articleId && !dto.ficheTechniqueId) {
      throw new BadRequestException(
        'Choisir un article ou une fiche technique',
      );
    }

    if (dto.articleId && dto.ficheTechniqueId) {
      throw new BadRequestException(
        'Choisir soit article, soit fiche technique',
      );
    }

    const article = dto.articleId
      ? await this.articleRepo.findOne({ where: { id: dto.articleId } })
      : null;

    const ficheTechnique = dto.ficheTechniqueId
      ? await this.ficheRepo.findOne({ where: { id: dto.ficheTechniqueId } })
      : null;

    if (dto.articleId && !article)
      throw new NotFoundException('Article introuvable');
    if (dto.ficheTechniqueId && !ficheTechnique)
      throw new NotFoundException('Fiche technique introuvable');

    const item = new ConditionnementProduit();

    item.article = article;
    item.ficheTechnique = ficheTechnique;
    item.type = dto.type;
    item.actif = dto.actif ?? true;

    item.quantiteAchat = dto.quantiteAchat ?? 1;
    item.uniteAchat = dto.uniteAchatId
      ? await this.findUnite(dto.uniteAchatId)
      : null;

    item.quantiteInventaire = dto.quantiteInventaire ?? 1;
    item.uniteInventaire = dto.uniteInventaireId
      ? await this.findUnite(dto.uniteInventaireId)
      : null;

    item.quantiteFt = dto.quantiteFt ?? 1;
    item.uniteFt = dto.uniteFtId ? await this.findUnite(dto.uniteFtId) : null;

    return this.conditionnementProduitRepo.save(item);
  }

  findAllProduits() {
    return this.conditionnementProduitRepo.find({
      relations: [
        'article',
        'ficheTechnique',
        'uniteAchat',
        'uniteInventaire',
        'utilisations',
        'utilisations.unite',
      ],
      order: { id: 'DESC' },
    });
  }

  async findProduit(id: number) {
    const item = await this.conditionnementProduitRepo.findOne({
      where: { id },
      relations: [
        'article',
        'ficheTechnique',
        'uniteAchat',
        'uniteInventaire',
        'uniteFt',
      ],
    });

    if (!item)
      throw new NotFoundException('Conditionnement produit introuvable');

    return item;
  }

  async updateProduit(id: number, dto: UpdateConditionnementProduitDto) {
    const item = await this.findProduit(id);

    if (dto.actif !== undefined) item.actif = dto.actif;
    if (dto.type !== undefined) item.type = dto.type;

    if (dto.quantiteAchat !== undefined) item.quantiteAchat = dto.quantiteAchat;
    if (dto.uniteAchatId !== undefined) {
      item.uniteAchat = dto.uniteAchatId
        ? await this.findUnite(dto.uniteAchatId)
        : null;
    }

    if (dto.quantiteInventaire !== undefined)
      item.quantiteInventaire = dto.quantiteInventaire;
    if (dto.uniteInventaireId !== undefined) {
      item.uniteInventaire = dto.uniteInventaireId
        ? await this.findUnite(dto.uniteInventaireId)
        : null;
    }

    if (dto.quantiteFt !== undefined) item.quantiteFt = dto.quantiteFt;
    if (dto.uniteFtId !== undefined) {
      item.uniteFt = dto.uniteFtId ? await this.findUnite(dto.uniteFtId) : null;
    }

    return this.conditionnementProduitRepo.save(item);
  }

  async removeProduit(id: number) {
    const item = await this.findProduit(id);
    await this.conditionnementProduitRepo.remove(item);

    return {
      message: 'Conditionnement produit supprimé',
      id,
    };
  }

  async upsertConditionnement(dto: CreateConditionnementProduitDto) {
    let item: ConditionnementProduit | null = null;

    if (dto.articleId) {
      item = await this.conditionnementProduitRepo.findOne({
        where: { article: { id: dto.articleId } },
        relations: ['article'],
      });
    }

    if (dto.ficheTechniqueId) {
      item = await this.conditionnementProduitRepo.findOne({
        where: { ficheTechnique: { id: dto.ficheTechniqueId } },
        relations: ['ficheTechnique'],
      });
    }

    if (!item) {
      item = new ConditionnementProduit();
    }

    item.article = dto.articleId
      ? await this.articleRepo.findOne({ where: { id: dto.articleId } })
      : null;

    item.ficheTechnique = dto.ficheTechniqueId
      ? await this.ficheRepo.findOne({ where: { id: dto.ficheTechniqueId } })
      : null;

    item.quantiteAchat = dto.quantiteAchat ?? 1;
    item.uniteAchat = dto.uniteAchatId
      ? await this.findUnite(dto.uniteAchatId)
      : null;

    item.quantiteInventaire = dto.quantiteInventaire ?? 1;
    item.uniteInventaire = dto.uniteInventaireId
      ? await this.findUnite(dto.uniteInventaireId)
      : null;

    item.quantiteFt = dto.quantiteFt ?? 1;
    item.uniteFt = dto.uniteFtId ? await this.findUnite(dto.uniteFtId) : null;

    return this.conditionnementProduitRepo.save(item);
  }

  findByArticle(articleId: number) {
    return this.conditionnementProduitRepo.findOne({
      where: {
        article: { id: articleId },
      },
      relations: ['article', 'uniteAchat', 'uniteInventaire', 'uniteFt'],
    });
  }

  async addUtilisation(dto: CreateConditionnementUtilisationDto) {
    const conditionnementProduit =
      await this.conditionnementProduitRepo.findOne({
        where: { id: dto.conditionnementProduitId },
      });

    if (!conditionnementProduit) {
      throw new NotFoundException('Conditionnement produit introuvable');
    }

    const unite = await this.findUnite(dto.uniteId);

    const item = this.utilisationRepo.create({
      conditionnementProduit,
      quantite: dto.quantite,
      unite,
      type: dto.type,
      actif: dto.actif ?? true,
    });

    return this.utilisationRepo.save(item);
  }

  findUtilisationsByProduit(conditionnementProduitId: number) {
    return this.utilisationRepo.find({
      where: {
        conditionnementProduit: { id: conditionnementProduitId },
        actif: true,
      },
      relations: ['unite', 'conditionnementProduit'],
      order: { id: 'DESC' },
    });
  }

  async removeUtilisation(id: number) {
    const item = await this.utilisationRepo.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Utilisation introuvable');
    }

    await this.utilisationRepo.remove(item);

    return { message: 'Utilisation supprimée', id };
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleFournisseur } from './entities/article-fournisseur.entity';
import { CreateArticleFournisseurDto } from './dto/create-article-fournisseur.dto';
import { UpdateArticleFournisseurDto } from './dto/update-article-fournisseur.dto';

import { Article } from '../articles/entities/article.entity';
import { Fournisseur } from '../fournisseurs/entities/fournisseur.entity';
import { Unite } from '../unites/entities/unite.entity';

@Injectable()
export class ArticleFournisseursService {
  constructor(
    @InjectRepository(ArticleFournisseur)
    private readonly repo: Repository<ArticleFournisseur>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(Fournisseur)
    private readonly fournisseurRepo: Repository<Fournisseur>,

    @InjectRepository(Unite)
    private readonly uniteRepo: Repository<Unite>,
  ) {}

  async create(dto: CreateArticleFournisseurDto) {
    const article = await this.findArticle(dto.articleId);
    const fournisseur = await this.findFournisseur(dto.fournisseurId);
    const unite = await this.findUnite(dto.uniteId);

    if (dto.fournisseurPrincipal) {
      await this.repo.update(
        { article: { id: article.id } },
        { fournisseurPrincipal: false },
      );
    }

    const existing = await this.repo.findOne({
      where: {
        article: { id: article.id },
        fournisseur: { id: fournisseur.id },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Ce fournisseur est déjà lié à cet article',
      );
    }

    const item = this.repo.create({
      article,
      fournisseur,
      unite,
      prixAchat: Number(dto.prixAchat),
      referenceFournisseur: dto.referenceFournisseur ?? undefined,
      delaiLivraisonJours: dto.delaiLivraisonJours ?? undefined,
      fournisseurPrincipal: dto.fournisseurPrincipal ?? false,
      actif: dto.actif ?? true,
    });

    return this.repo.save(item);
  }

  findAll() {
    return this.repo.find({
      relations: ['article', 'fournisseur', 'unite'],
      order: { id: 'DESC' },
    });
  }

  findByArticle(articleId: number) {
    return this.repo.find({
      where: {
        article: { id: articleId },
      },
      relations: ['article', 'fournisseur', 'unite'],
      order: {
        fournisseurPrincipal: 'DESC',
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['article', 'fournisseur', 'unite'],
    });

    if (!item) {
      throw new NotFoundException('Article fournisseur introuvable');
    }

    return item;
  }

  async update(id: number, dto: UpdateArticleFournisseurDto) {
    const item = await this.findOne(id);

    if (dto.articleId !== undefined) {
      item.article = await this.findArticle(dto.articleId);
    }

    if (dto.fournisseurId !== undefined) {
      item.fournisseur = await this.findFournisseur(dto.fournisseurId);
    }

    if (dto.uniteId !== undefined) {
      item.unite = await this.findUnite(dto.uniteId);
    }

    if (dto.prixAchat !== undefined) item.prixAchat = dto.prixAchat;
    if (dto.referenceFournisseur !== undefined) {
      item.referenceFournisseur = dto.referenceFournisseur;
    }
    if (dto.delaiLivraisonJours !== undefined) {
      item.delaiLivraisonJours = dto.delaiLivraisonJours;
    }
    if (dto.actif !== undefined) item.actif = dto.actif;

    if (dto.fournisseurPrincipal !== undefined) {
      if (dto.fournisseurPrincipal) {
        await this.repo.update(
          { article: { id: item.article.id } },
          { fournisseurPrincipal: false },
        );
      }

      item.fournisseurPrincipal = dto.fournisseurPrincipal;
    }

    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);

    return {
      message: 'Lien article fournisseur supprimé',
      id,
    };
  }

  private async findArticle(id: number) {
    const item = await this.articleRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Article introuvable');
    return item;
  }

  private async findFournisseur(id: number) {
    const item = await this.fournisseurRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Fournisseur introuvable');
    return item;
  }

  private async findUnite(id: number) {
    const item = await this.uniteRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Unité introuvable');
    return item;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Article } from './entities/article.entity';
import { Unite } from '../unites/entities/unite.entity';
import { Famille } from '../familles/entities/famille.entity';
import { Allergene } from '../allergenes/entities/allergene.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Fournisseur } from 'src/fournisseurs/entities/fournisseur.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Unite)
    private readonly uniteRepository: Repository<Unite>,

    @InjectRepository(Famille)
    private readonly familleRepository: Repository<Famille>,

    @InjectRepository(Allergene)
    private readonly allergeneRepository: Repository<Allergene>,

    @InjectRepository(Fournisseur)
    private readonly fournisseurRepo: Repository<Fournisseur>,
  ) {}

  async create(dto: CreateArticleDto) {
    const unite = await this.findUnite(dto.uniteId);
    const famille = dto.familleId
      ? await this.findFamille(dto.familleId)
      : null;

    const allergenes = dto.allergeneIds?.length
      ? await this.allergeneRepository.findBy({ id: In(dto.allergeneIds) })
      : [];

    const fournisseur = dto.fournisseurId
      ? await this.fournisseurRepo.findOne({ where: { id: dto.fournisseurId } })
      : null;

    const article = this.articleRepository.create({
      reference: dto.reference,
      nom: dto.nom,
      description: dto.description,
      unite,
      famille,
      allergenes,
      prixAchat: dto.prixAchat ?? 0,
      seuilMinimum: dto.seuilMinimum ?? 0,
      actif: dto.actif ?? true,
      fournisseur,
    });

    const uniteSeuilMinimum = dto.uniteSeuilMinimumId
      ? await this.findUnite(dto.uniteSeuilMinimumId)
      : unite;

    return this.articleRepository.save(article);
  }

  findAll() {
    return this.articleRepository.find({
      relations: [
        'unite',
        'famille',
        'allergenes',
        'conditionnement',
        'conditionnement.uniteAchat',
        'conditionnement.uniteInventaire',
        'conditionnement.uniteFt',
        'uniteSeuilMinimum',
        'fournisseur',
        'fournisseurs',
        'fournisseurs.fournisseur',
        'fournisseurs.unite',
      ],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: [
        'unite',
        'famille',
        'allergenes',
        'uniteSeuilMinimum',
        'fournisseur',
        'fournisseurs.fournisseur',
        'fournisseurs.unite',
      ],
    });

    if (!article) {
      throw new NotFoundException(`Article avec l'id ${id} introuvable`);
    }

    return article;
  }

  async update(id: number, dto: UpdateArticleDto) {
    const article = await this.findOne(id);

    if (dto.reference !== undefined) article.reference = dto.reference;
    if (dto.nom !== undefined) article.nom = dto.nom;
    if (dto.description !== undefined) article.description = dto.description;
    if (dto.prixAchat !== undefined) article.prixAchat = dto.prixAchat;
    if (dto.seuilMinimum !== undefined) article.seuilMinimum = dto.seuilMinimum;
    if (dto.actif !== undefined) article.actif = dto.actif;
    if (dto.fournisseurId !== undefined) {
      article.fournisseur = dto.fournisseurId
        ? await this.fournisseurRepo.findOne({
            where: { id: dto.fournisseurId },
          })
        : null;
    }

    if (dto.uniteId !== undefined) {
      article.unite = await this.findUnite(dto.uniteId);
    }

    if (dto.familleId !== undefined) {
      article.famille = dto.familleId
        ? await this.findFamille(dto.familleId)
        : null;
    }

    if (dto.allergeneIds !== undefined) {
      article.allergenes = dto.allergeneIds.length
        ? await this.allergeneRepository.findBy({ id: In(dto.allergeneIds) })
        : [];
    }

    if (dto.uniteSeuilMinimumId !== undefined) {
      article.uniteSeuilMinimum = dto.uniteSeuilMinimumId
        ? await this.findUnite(dto.uniteSeuilMinimumId)
        : null;
    }

    return this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);

    return {
      message: 'Article supprimé avec succès',
      id,
    };
  }

  private async findUnite(id: number) {
    const unite = await this.uniteRepository.findOne({ where: { id } });
    if (!unite) throw new NotFoundException('Unité introuvable');
    return unite;
  }

  private async findFamille(id: number) {
    const famille = await this.familleRepository.findOne({ where: { id } });
    if (!famille) throw new NotFoundException('Famille introuvable');
    return famille;
  }
}

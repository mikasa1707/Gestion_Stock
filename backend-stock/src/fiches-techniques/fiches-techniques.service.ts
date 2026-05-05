import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FicheTechnique } from './entities/fiche-technique.entity';
import { CreateFicheTechniqueDto } from './dto/create-fiche-technique.dto';
import { UpdateFicheTechniqueDto } from './dto/update-fiche-technique.dto';

import { CompositionFicheTechnique } from './entities/composition-fiche-technique.entity';
import { Article } from '../articles/entities/article.entity';
import { CreateCompositionDto } from './dto/create-composition.dto';

import { Unite } from '../unites/entities/unite.entity';
import { Famille } from '../familles/entities/famille.entity';
// import { ConditionnementProduit } from '../conditionnements/entities/conditionnement-produit.entity';
import { ConditionnementUtilisation } from '../conditionnements/entities/conditionnement-utilisation.entity';

@Injectable()
export class FichesTechniquesService {
  constructor(
    @InjectRepository(FicheTechnique)
    private readonly ficheTechniqueRepository: Repository<FicheTechnique>,
    @InjectRepository(CompositionFicheTechnique)
    private readonly compositionRepo: Repository<CompositionFicheTechnique>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(Unite)
    private readonly uniteRepository: Repository<Unite>,

    @InjectRepository(Famille)
    private readonly familleRepository: Repository<Famille>,

    // @InjectRepository(ConditionnementProduit)
    // private readonly conditionnementProduitRepo: Repository<ConditionnementProduit>,

    @InjectRepository(ConditionnementUtilisation)
    private readonly utilisationRepo: Repository<ConditionnementUtilisation>,
  ) {}

  async create(dto: CreateFicheTechniqueDto) {
    const unite = await this.findUnite(dto.uniteId);
    console.log(unite);
    const famille = dto.familleId
      ? await this.findFamille(dto.familleId)
      : null;

    const fiche = this.ficheTechniqueRepository.create({
      reference: dto.reference,
      nom: dto.nom,
      description: dto.description,
      unite,
      famille,
      prixVente: dto.prixVente ?? 0,
      seuilMinimum: dto.seuilMinimum ?? 0,
      actif: dto.actif ?? true,
    });

    return this.ficheTechniqueRepository.save(fiche);
  }

  findAll() {
    return this.ficheTechniqueRepository.find({
      relations: ['unite', 'famille'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const fiche = await this.ficheTechniqueRepository.findOne({
      where: { id },
      relations: ['unite', 'famille'],
    });

    if (!fiche) {
      throw new NotFoundException(`Fiche technique ${id} introuvable`);
    }

    return fiche;
  }

  async update(id: number, dto: UpdateFicheTechniqueDto) {
    const fiche = await this.findOne(id);

    if (dto.reference !== undefined) fiche.reference = dto.reference;
    if (dto.nom !== undefined) fiche.nom = dto.nom;
    if (dto.description !== undefined) fiche.description = dto.description;
    if (dto.prixVente !== undefined) fiche.prixVente = dto.prixVente;
    if (dto.seuilMinimum !== undefined) fiche.seuilMinimum = dto.seuilMinimum;
    if (dto.actif !== undefined) fiche.actif = dto.actif;

    if (dto.uniteId !== undefined) {
      fiche.unite = await this.findUnite(dto.uniteId);
    }

    if (dto.familleId !== undefined) {
      fiche.famille = dto.familleId
        ? await this.findFamille(dto.familleId)
        : null;
    }

    return this.ficheTechniqueRepository.save(fiche);
  }

  async remove(id: number) {
    const fiche = await this.findOne(id);
    await this.ficheTechniqueRepository.remove(fiche);

    return {
      message: 'Fiche technique supprimée avec succès',
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

  async addComposition(dto: CreateCompositionDto) {
    if (!dto.articleId && !dto.ficheTechniqueComposantId) {
      throw new BadRequestException(
        'La composition doit contenir un article ou une fiche technique',
      );
    }

    if (dto.articleId && dto.ficheTechniqueComposantId) {
      throw new BadRequestException(
        'Choisir soit un article, soit une fiche technique, pas les deux',
      );
    }

    const ficheTechnique = await this.findOne(dto.ficheTechniqueId);

    const article = dto.articleId
      ? await this.articleRepo.findOne({ where: { id: dto.articleId } })
      : null;

    const ficheTechniqueComposant = dto.ficheTechniqueComposantId
      ? await this.ficheTechniqueRepository.findOne({
          where: { id: dto.ficheTechniqueComposantId },
        })
      : null;

    const conditionnementUtilisation = await this.utilisationRepo.findOne({
      where: { id: dto.conditionnementUtilisationId },
      relations: [
        'unite',
        // 'conditionnementUtilisation',
        // 'conditionnementUtilisation.uniteAchat',
        'conditionnementProduit',
        'conditionnementProduit.uniteAchat',
        'conditionnementProduit.uniteInventaire',
      ],
    });

    if (!conditionnementUtilisation) {
      throw new NotFoundException('Utilisation introuvable');
    }

    if (dto.articleId && !article) {
      throw new NotFoundException('Article composant introuvable');
    }

    if (dto.ficheTechniqueComposantId && !ficheTechniqueComposant) {
      throw new NotFoundException('Fiche technique composante introuvable');
    }

    if (dto.ficheTechniqueComposantId === dto.ficheTechniqueId) {
      throw new BadRequestException(
        'Une fiche technique ne peut pas se contenir elle-même',
      );
    }

    const composition = new CompositionFicheTechnique();

    composition.ficheTechnique = ficheTechnique;
    composition.article = article;
    composition.ficheTechniqueComposant = ficheTechniqueComposant;
    composition.quantite = dto.quantite;
    composition.conditionnementUtilisation = conditionnementUtilisation;

    return this.compositionRepo.save(composition);
  }

  findCompositionsByFiche(ficheTechniqueId: number) {
    return this.compositionRepo.find({
      where: {
        ficheTechnique: { id: ficheTechniqueId },
      },
      relations: [
        'ficheTechnique',
        'article',
        'article.unite',
        'ficheTechniqueComposant',
        // 'conditionnementProduit.uniteAchat',
        // 'conditionnementProduit.uniteInventaire',
        'conditionnementUtilisation',
        'conditionnementUtilisation.unite',
        'conditionnementUtilisation.conditionnementProduit',
        'conditionnementUtilisation.conditionnementProduit.uniteAchat',
      ],
      order: { id: 'DESC' },
    });
  }

  async removeComposition(id: number) {
    const composition = await this.compositionRepo.findOne({
      where: { id },
    });

    if (!composition) {
      throw new NotFoundException('Composition introuvable');
    }

    await this.compositionRepo.remove(composition);

    return {
      message: 'Composition supprimée',
      id,
    };
  }

  async calculerCout(id: number): Promise<{
    ficheTechniqueId: number;
    coutTotal: number;
  }> {
    const lignes = await this.compositionRepo.find({
      where: { ficheTechnique: { id } },
      relations: [
        'article',
        'article.unite',
        'ficheTechniqueComposant',

        'conditionnementUtilisation',
        'conditionnementUtilisation.unite',
        'conditionnementUtilisation.conditionnementProduit',
        'conditionnementUtilisation.conditionnementProduit.uniteAchat',
      ],
    });

    let coutTotal = 0;

    for (const ligne of lignes) {
      const multiplicateur = Number(ligne.quantite || 1);

      if (ligne.article) {
        const prixAchat = Number(ligne.article.prixAchat || 0);

        const uniteAchat =
          ligne.conditionnementUtilisation?.conditionnementProduit?.uniteAchat;

        const uniteUtilisation = ligne.conditionnementUtilisation?.unite;

        const quantiteUtilisation = Number(
          ligne.conditionnementUtilisation?.quantite || 0,
        );

        const facteurAchat = Number(uniteAchat?.facteurReference || 1);
        const facteurUtilisation = Number(
          uniteUtilisation?.facteurReference || 1,
        );

        const quantiteConvertie =
          (quantiteUtilisation * facteurUtilisation) / facteurAchat;

        const coutLigne = prixAchat * quantiteConvertie * multiplicateur;

        coutTotal += coutLigne;
      }

      if (ligne.ficheTechniqueComposant) {
        const coutSousFt = await this.calculerCout(
          ligne.ficheTechniqueComposant.id,
        );

        const coutLigne = coutSousFt.coutTotal * multiplicateur;

        coutTotal += coutLigne;
      }
    }

    return {
      ficheTechniqueId: id,
      coutTotal,
    };
  }

  async updateComposition(
    id: number,
    dto: {
      quantite?: number;
      conditionnementUtilisationId?: number;
    },
  ) {
    const composition = await this.compositionRepo.findOne({
      where: { id },
      relations: ['conditionnementUtilisation'],
    });

    if (!composition) {
      throw new NotFoundException('Composition introuvable');
    }

    if (dto.quantite !== undefined) {
      composition.quantite = Number(dto.quantite);
    }

    if (dto.conditionnementUtilisationId !== undefined) {
      const utilisation = await this.utilisationRepo.findOne({
        where: { id: Number(dto.conditionnementUtilisationId) },
        relations: [
          'unite',
          'conditionnementProduit',
          'conditionnementProduit.uniteAchat',
          'conditionnementProduit.uniteInventaire',
        ],
      });

      if (!utilisation) {
        throw new NotFoundException('Utilisation introuvable');
      }

      composition.conditionnementUtilisation = utilisation;
    }

    return this.compositionRepo.save(composition);
  }
}

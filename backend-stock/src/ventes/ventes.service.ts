import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vente } from './entities/vente.entity';
import { VenteLigne } from './entities/vente-ligne.entity';
import { CreateVenteDto } from './dto/create-vente.dto';

import { FicheTechnique } from '../fiches-techniques/entities/fiche-technique.entity';
import { StockService } from '../stock/stock.service';
import { FichesTechniquesService } from '../fiches-techniques/fiches-techniques.service';

@Injectable()
export class VentesService {
  constructor(
    @InjectRepository(Vente)
    private readonly venteRepo: Repository<Vente>,

    @InjectRepository(VenteLigne)
    private readonly ligneRepo: Repository<VenteLigne>,

    @InjectRepository(FicheTechnique)
    private readonly ficheRepo: Repository<FicheTechnique>,

    private readonly stockService: StockService,
    private readonly fichesTechniquesService: FichesTechniquesService,
  ) {}

  async create(dto: CreateVenteDto) {
    if (!dto.lignes?.length) {
      throw new BadRequestException(
        'Une vente doit contenir au moins une ligne',
      );
    }

    const vente = await this.venteRepo.save(
      this.venteRepo.create({
        reference: dto.reference,
        date: dto.date,
        client: dto.client ?? '',
        commentaire: dto.commentaire ?? null,
        montantTotal: 0,
      }),
    );

    let montantTotal = 0;

    for (const l of dto.lignes) {
      const ft = await this.findFicheTechnique(l.ficheTechniqueId);

      const quantite = Number(l.quantite);
      const prixUnitaire = Number(l.prixUnitaire);
      const montant = quantite * prixUnitaire;
      const coutFt = await this.fichesTechniquesService.calculerCout(ft.id);

      const coutMatiere = Number(coutFt.coutTotal || 0) * quantite;
      const marge = montant - coutMatiere;

      montantTotal += montant;

      await this.ligneRepo.save(
        this.ligneRepo.create({
          vente,
          ficheTechnique: ft,
          quantite,
          prixUnitaire,
          montant,
          coutMatiere,
          marge,
        }),
      );

      await this.stockService.sortieFicheTechnique(ft.id, quantite, 1, 1);
    }

    vente.montantTotal = montantTotal;
    await this.venteRepo.save(vente);

    return this.findOne(vente.id);
  }

  findAll() {
    return this.venteRepo.find({
      relations: ['lignes', 'lignes.ficheTechnique'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const vente = await this.venteRepo.findOne({
      where: { id },
      relations: ['lignes', 'lignes.ficheTechnique'],
    });

    if (!vente) {
      throw new NotFoundException('Vente introuvable');
    }

    return vente;
  }

  async remove(id: number) {
    const vente = await this.findOne(id);
    await this.venteRepo.remove(vente);

    return {
      message: 'Vente supprimée',
      id,
    };
  }

  private async findFicheTechnique(id: number) {
    const ft = await this.ficheRepo.findOne({
      where: { id },
      relations: ['unite'],
    });

    if (!ft) {
      throw new NotFoundException('Fiche technique introuvable');
    }

    return ft;
  }
}

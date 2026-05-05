import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transfert } from './entities/transfert.entity';
import { TransfertLigne } from './entities/transfert-ligne.entity';
import { CreateTransfertDto } from './dto/create-transfert.dto';

import { Article } from '../articles/entities/article.entity';
import { Unite } from '../unites/entities/unite.entity';
import { LieuStockage } from '../stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from '../stockage/entities/zone-stockage.entity';

import { StockService } from '../stock/stock.service';
import { TypeMouvementStock } from '../stock/entities/mouvement-stock.entity';

@Injectable()
export class TransfertsService {
  constructor(
    @InjectRepository(Transfert)
    private readonly transfertRepo: Repository<Transfert>,

    @InjectRepository(TransfertLigne)
    private readonly ligneRepo: Repository<TransfertLigne>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(Unite)
    private readonly uniteRepo: Repository<Unite>,

    @InjectRepository(LieuStockage)
    private readonly lieuRepo: Repository<LieuStockage>,

    @InjectRepository(ZoneStockage)
    private readonly zoneRepo: Repository<ZoneStockage>,

    private readonly stockService: StockService,
  ) {}

  async create(dto: CreateTransfertDto) {
    if (!dto.lignes?.length) {
      throw new BadRequestException('Un transfert doit contenir au moins une ligne');
    }

    const transfert = await this.transfertRepo.save(
      this.transfertRepo.create({
        reference: dto.reference,
        date: dto.date,
        commentaire: dto.commentaire ?? null,
      }),
    );

    for (const l of dto.lignes) {
      const article = await this.findArticle(l.articleId);
      const unite = await this.findUnite(l.uniteId);
      const lieuSource = await this.findLieu(l.lieuSourceId);
      const zoneSource = await this.findZone(l.zoneSourceId);
      const lieuDestination = await this.findLieu(l.lieuDestinationId);
      const zoneDestination = await this.findZone(l.zoneDestinationId);

      await this.ligneRepo.save(
        this.ligneRepo.create({
          transfert,
          article,
          unite,
          quantite: Number(l.quantite),
          lieuSource,
          zoneSource,
          lieuDestination,
          zoneDestination,
        }),
      );

      await this.stockService.mouvement({
        typeMouvement: TypeMouvementStock.SORTIE,
        articleId: article.id,
        quantite: Number(l.quantite),
        uniteId: unite.id,
        lieuStockageId: lieuSource.id,
        zoneStockageId: zoneSource.id,
        commentaire: `Transfert ${transfert.reference} - sortie`,
      });

      await this.stockService.mouvement({
        typeMouvement: TypeMouvementStock.ENTREE,
        articleId: article.id,
        quantite: Number(l.quantite),
        uniteId: unite.id,
        lieuStockageId: lieuDestination.id,
        zoneStockageId: zoneDestination.id,
        commentaire: `Transfert ${transfert.reference} - entrée`,
      });
    }

    return this.findOne(transfert.id);
  }

  findAll() {
    return this.transfertRepo.find({
      relations: [
        'lignes',
        'lignes.article',
        'lignes.unite',
        'lignes.lieuSource',
        'lignes.zoneSource',
        'lignes.lieuDestination',
        'lignes.zoneDestination',
      ],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const item = await this.transfertRepo.findOne({
      where: { id },
      relations: [
        'lignes',
        'lignes.article',
        'lignes.unite',
        'lignes.lieuSource',
        'lignes.zoneSource',
        'lignes.lieuDestination',
        'lignes.zoneDestination',
      ],
    });

    if (!item) throw new NotFoundException('Transfert introuvable');

    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.transfertRepo.remove(item);

    return { message: 'Transfert supprimé', id };
  }

  private async findArticle(id: number) {
    const item = await this.articleRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Article introuvable');
    return item;
  }

  private async findUnite(id: number) {
    const item = await this.uniteRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Unité introuvable');
    return item;
  }

  private async findLieu(id: number) {
    const item = await this.lieuRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Lieu introuvable');
    return item;
  }

  private async findZone(id: number) {
    const item = await this.zoneRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Zone introuvable');
    return item;
  }
}
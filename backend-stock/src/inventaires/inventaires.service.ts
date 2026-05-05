import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inventaire } from './entities/inventaire.entity';
import { InventaireLigne } from './entities/inventaire-ligne.entity';
import { CreateInventaireDto } from './dto/create-inventaire.dto';

import { Article } from '../articles/entities/article.entity';
import { Unite } from '../unites/entities/unite.entity';
import { StockService } from '../stock/stock.service';
import { TypeMouvementStock } from '../stock/entities/mouvement-stock.entity';

@Injectable()
export class InventairesService {
  constructor(
    @InjectRepository(Inventaire)
    private readonly inventaireRepo: Repository<Inventaire>,

    @InjectRepository(InventaireLigne)
    private readonly ligneRepo: Repository<InventaireLigne>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(Unite)
    private readonly uniteRepo: Repository<Unite>,

    private readonly stockService: StockService,
  ) {}

  async create(dto: CreateInventaireDto) {
    if (!dto.lignes?.length) {
      throw new BadRequestException('Un inventaire doit contenir au moins une ligne');
    }

    const inventaire = await this.inventaireRepo.save(
      this.inventaireRepo.create({
        reference: dto.reference,
        date: dto.date,
        commentaire: dto.commentaire ?? null,
      }),
    );

    for (const l of dto.lignes) {
      const article = await this.findArticle(l.articleId);
      const unite = await this.findUnite(l.uniteId);

      await this.ligneRepo.save(
        this.ligneRepo.create({
          inventaire,
          article,
          unite,
          quantiteComptee: Number(l.quantiteComptee),
        }),
      );

      await this.stockService.mouvement({
        typeMouvement: TypeMouvementStock.INVENTAIRE,
        articleId: article.id,
        quantite: Number(l.quantiteComptee),
        uniteId: unite.id,
        lieuStockageId: 1,
        zoneStockageId: 1,
        commentaire: `Inventaire ${inventaire.reference}`,
      });
    }

    return this.findOne(inventaire.id);
  }

  findAll() {
    return this.inventaireRepo.find({
      relations: ['lignes', 'lignes.article', 'lignes.unite'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const item = await this.inventaireRepo.findOne({
      where: { id },
      relations: ['lignes', 'lignes.article', 'lignes.unite'],
    });

    if (!item) throw new NotFoundException('Inventaire introuvable');

    return item;
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.inventaireRepo.remove(item);

    return { message: 'Inventaire supprimé', id };
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
}
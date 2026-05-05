import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventairesController } from './inventaires.controller';
import { InventairesService } from './inventaires.service';

import { Inventaire } from './entities/inventaire.entity';
import { InventaireLigne } from './entities/inventaire-ligne.entity';
import { Article } from '../articles/entities/article.entity';
import { Unite } from '../unites/entities/unite.entity';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventaire, InventaireLigne, Article, Unite]),
    StockModule,
  ],
  controllers: [InventairesController],
  providers: [InventairesService],
})
export class InventairesModule {}
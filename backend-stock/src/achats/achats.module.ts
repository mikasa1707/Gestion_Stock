import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AchatsController } from './achats.controller';
import { AchatsService } from './achats.service';

import { Achat } from './entities/achat.entity';
import { AchatLigne } from './entities/achat-ligne.entity';
import { Article } from '../articles/entities/article.entity';
import { Unite } from '../unites/entities/unite.entity';
import { StockModule } from '../stock/stock.module';
import { ArticleFournisseur } from 'src/article-fournisseurs/entities/article-fournisseur.entity';
import { Fournisseur } from 'src/fournisseurs/entities/fournisseur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achat, AchatLigne, Article, Unite, ArticleFournisseur, Fournisseur]),
    StockModule,
  ],
  controllers: [AchatsController],
  providers: [AchatsService],
})
export class AchatsModule {}
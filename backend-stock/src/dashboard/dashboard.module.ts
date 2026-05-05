import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Article } from '../articles/entities/article.entity';
import { FicheTechnique } from '../fiches-techniques/entities/fiche-technique.entity';
import { MouvementStock } from '../stock/entities/mouvement-stock.entity';
import { Vente } from '../ventes/entities/vente.entity';
import { VenteLigne } from '../ventes/entities/vente-ligne.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      FicheTechnique,
      MouvementStock,
      Vente,
      VenteLigne,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
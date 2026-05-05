import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VentesController } from './ventes.controller';
import { VentesService } from './ventes.service';

import { Vente } from './entities/vente.entity';
import { VenteLigne } from './entities/vente-ligne.entity';
import { FicheTechnique } from '../fiches-techniques/entities/fiche-technique.entity';
import { StockModule } from '../stock/stock.module';
import { FichesTechniquesModule } from '../fiches-techniques/fiches-techniques.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vente, VenteLigne, FicheTechnique]),
    StockModule,
    FichesTechniquesModule,
  ],
  controllers: [VentesController],
  providers: [VentesService],
})
export class VentesModule {}

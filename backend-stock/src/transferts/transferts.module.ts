import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransfertsController } from './transferts.controller';
import { TransfertsService } from './transferts.service';

import { Transfert } from './entities/transfert.entity';
import { TransfertLigne } from './entities/transfert-ligne.entity';
import { Article } from '../articles/entities/article.entity';
import { Unite } from '../unites/entities/unite.entity';
import { LieuStockage } from '../stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from '../stockage/entities/zone-stockage.entity';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transfert,
      TransfertLigne,
      Article,
      Unite,
      LieuStockage,
      ZoneStockage,
    ]),
    StockModule,
  ],
  controllers: [TransfertsController],
  providers: [TransfertsService],
})
export class TransfertsModule {}
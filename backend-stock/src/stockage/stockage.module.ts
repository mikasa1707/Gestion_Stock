import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockageController } from './stockage.controller';
import { StockageService } from './stockage.service';
import { LieuStockage } from './entities/lieu-stockage.entity';
import { ZoneStockage } from './entities/zone-stockage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LieuStockage, ZoneStockage])],
  controllers: [StockageController],
  providers: [StockageService],
  exports: [StockageService, TypeOrmModule],
})
export class StockageModule {}
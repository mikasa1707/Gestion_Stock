import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { FicheTechnique } from 'src/fiches-techniques/entities/fiche-technique.entity';
import { LieuStockage } from 'src/stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from 'src/stockage/entities/zone-stockage.entity';
import { MouvementStock } from './entities/mouvement-stock.entity';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from 'src/security/security.module';
import { Unite } from '../unites/entities/unite.entity';
import { CompositionFicheTechnique } from '../fiches-techniques/entities/composition-fiche-technique.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    SecurityModule,
    TypeOrmModule.forFeature([
      MouvementStock,
      Article,
      FicheTechnique,
      LieuStockage,
      ZoneStockage,
      Unite,
      CompositionFicheTechnique,
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}

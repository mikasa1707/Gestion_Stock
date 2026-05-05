import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { UtilisateursModule } from '../utilisateurs/utilisateurs.module';
import { LieuStockage } from '../stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from '../stockage/entities/zone-stockage.entity';
import { Unite } from '../unites/entities/unite.entity';
import { Allergene } from '../allergenes/entities/allergene.entity';
import { Famille } from '../familles/entities/famille.entity';

@Module({
  imports: [
    UtilisateursModule,
    TypeOrmModule.forFeature([LieuStockage, ZoneStockage, Unite, Allergene, Famille]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
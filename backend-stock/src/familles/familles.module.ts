import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Famille } from './entities/famille.entity';
import { FamillesController } from './familles.controller';
import { FamillesService } from './familles.service';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Famille])],
  controllers: [FamillesController],
  providers: [FamillesService],
  exports: [FamillesService],
})
export class FamillesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConditionnementsController } from './conditionnements.controller';
import { ConditionnementsService } from './conditionnements.service';
import { Conditionnement } from './entities/conditionnement.entity';
import { Unite } from '../unites/entities/unite.entity';
import { SecurityModule } from '../security/security.module';

import { ConditionnementProduit } from './entities/conditionnement-produit.entity';
import { ConditionnementUtilisation } from './entities/conditionnement-utilisation.entity';
import { Article } from '../articles/entities/article.entity';
import { FicheTechnique } from '../fiches-techniques/entities/fiche-technique.entity';

@Module({
  imports: [
    SecurityModule,
    TypeOrmModule.forFeature([
      Conditionnement,
      ConditionnementProduit,
      ConditionnementUtilisation,
      Unite,
      Article,
      FicheTechnique,
    ]),
  ],
  controllers: [ConditionnementsController],
  providers: [ConditionnementsService],
  exports: [ConditionnementsService],
})
export class ConditionnementsModule {}

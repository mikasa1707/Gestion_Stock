import { Module } from '@nestjs/common';
import { FichesTechniquesController } from './fiches-techniques.controller';
import { FichesTechniquesService } from './fiches-techniques.service';
import { FicheTechnique } from './entities/fiche-technique.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompositionFicheTechnique } from './entities/composition-fiche-technique.entity';
import { Article } from '../articles/entities/article.entity';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from 'src/security/security.module';
import { Unite } from '../unites/entities/unite.entity';
import { Famille } from '../familles/entities/famille.entity';
import { ConditionnementProduit } from '../conditionnements/entities/conditionnement-produit.entity';
import { ConditionnementUtilisation } from '../conditionnements/entities/conditionnement-utilisation.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    SecurityModule,
    TypeOrmModule.forFeature([
      FicheTechnique,
      CompositionFicheTechnique,
      Article,
      Famille,
      Unite,
      // ConditionnementProduit,
      ConditionnementUtilisation
    ]),
  ],
  controllers: [FichesTechniquesController],
  providers: [FichesTechniquesService],
  exports: [FichesTechniquesService],
})
export class FichesTechniquesModule {}

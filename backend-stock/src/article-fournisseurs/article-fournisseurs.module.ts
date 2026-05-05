import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleFournisseursController } from './article-fournisseurs.controller';
import { ArticleFournisseursService } from './article-fournisseurs.service';

import { ArticleFournisseur } from './entities/article-fournisseur.entity';
import { Article } from '../articles/entities/article.entity';
import { Fournisseur } from '../fournisseurs/entities/fournisseur.entity';
import { Unite } from '../unites/entities/unite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleFournisseur,
      Article,
      Fournisseur,
      Unite,
    ]),
  ],
  controllers: [ArticleFournisseursController],
  providers: [ArticleFournisseursService],
  exports: [ArticleFournisseursService],
})
export class ArticleFournisseursModule {}
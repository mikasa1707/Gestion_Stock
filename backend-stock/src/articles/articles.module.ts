import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './entities/article.entity';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from 'src/security/security.module';
import { Famille } from 'src/familles/entities/famille.entity';
import { Unite } from 'src/unites/entities/unite.entity';
import { Allergene } from 'src/allergenes/entities/allergene.entity';
import { Fournisseur } from 'src/fournisseurs/entities/fournisseur.entity';
import { ArticleFournisseur } from 'src/article-fournisseurs/entities/article-fournisseur.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    SecurityModule,
    TypeOrmModule.forFeature([Article, Unite, Famille, Allergene, Fournisseur, ArticleFournisseur]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}

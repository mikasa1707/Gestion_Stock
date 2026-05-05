import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesModule } from './articles/articles.module';
import { FichesTechniquesModule } from './fiches-techniques/fiches-techniques.module';
import { StockageModule } from './stockage/stockage.module';
import { StockModule } from './stock/stock.module';
import { AchatsModule } from './achats/achats.module';
import { VentesModule } from './ventes/ventes.module';
import { InventairesModule } from './inventaires/inventaires.module';
import { TransfertsModule } from './transferts/transferts.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SecurityModule } from './security/security.module';
import { SeedModule } from './seed/seed.module';
import { UnitesModule } from './unites/unites.module';
import { FamillesModule } from './familles/familles.module';
import { AllergenesModule } from './allergenes/allergenes.module';
import { ConditionnementsModule } from './conditionnements/conditionnements.module';
import { FournisseursModule } from './fournisseurs/fournisseurs.module';
import { ArticleFournisseursModule } from './article-fournisseurs/article-fournisseurs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'gestion_stock',
      autoLoadEntities: true,
      synchronize: true,
    }),

    SeedModule,
    AuthModule,
    UtilisateursModule,
    ArticlesModule,
    FichesTechniquesModule,
    StockageModule,
    StockModule,
    AchatsModule,
    VentesModule,
    InventairesModule,
    TransfertsModule,
    DashboardModule,
    SecurityModule,
    UnitesModule,
    FamillesModule,
    AllergenesModule,
    ConditionnementsModule,
    FournisseursModule,
    ArticleFournisseursModule,
  ],
})
export class AppModule {}

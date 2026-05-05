import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UtilisateursService } from '../utilisateurs/utilisateurs.service';
import { ProfilUtilisateur } from '../utilisateurs/entities/utilisateur.entity';

import { LieuStockage } from '../stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from '../stockage/entities/zone-stockage.entity';
import { Unite } from '../unites/entities/unite.entity';
import { Allergene } from '../allergenes/entities/allergene.entity';
import { Famille, TypeFamille } from '../familles/entities/famille.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly utilisateursService: UtilisateursService,

    @InjectRepository(LieuStockage)
    private readonly lieuRepo: Repository<LieuStockage>,

    @InjectRepository(ZoneStockage)
    private readonly zoneRepo: Repository<ZoneStockage>,

    @InjectRepository(Unite)
    private readonly uniteRepo: Repository<Unite>,

    @InjectRepository(Allergene)
    private readonly allergeneRepo: Repository<Allergene>,

    @InjectRepository(Famille)
    private readonly familleRepo: Repository<Famille>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🌱 SEED START');

    await this.seedAdmin();
    await this.seedStockage();
    await this.seedUnites();
    await this.seedFamilles();
    await this.seedAllergenes();

    console.log('🌱 SEED DONE');
  }

  async seedAdmin() {
    const existing =
      await this.utilisateursService.findByEmailWithPassword('admin@test.com');

    if (!existing) {
      await this.utilisateursService.create({
        nom: 'Admin',
        email: 'admin@test.com',
        motDePasse: '123456',
        profil: ProfilUtilisateur.ADMIN,
        actif: true,
      });

      console.log('✔ Admin créé');
    } else {
      console.log('✔ Admin déjà existant');
    }
  }

  async seedStockage() {
    let lieu = await this.lieuRepo.findOne({
      where: { nom: 'Dépôt principal' },
    });

    if (!lieu) {
      lieu = await this.lieuRepo.save(
        this.lieuRepo.create({
          nom: 'Dépôt principal',
          description: 'Lieu principal',
        }),
      );

      console.log('✔ Lieu créé');
    } else {
      console.log('✔ Lieu déjà existant');
    }

    const zone = await this.zoneRepo.findOne({
      where: {
        nom: 'Zone A',
        lieuStockage: { id: lieu.id },
      },
      relations: ['lieuStockage'],
    });

    if (!zone) {
      await this.zoneRepo.save(
        this.zoneRepo.create({
          nom: 'Zone principale',
          description: 'Zone par défaut',
          actif: true,
          lieuStockage: lieu,
        }),
      );

      console.log('✔ Zone créée');
    } else {
      console.log('✔ Zone déjà existante');
    }
  }

  async seedUnites() {
    const data = [
      { code: 'KG', libelle: 'Kilogramme', facteurReference: 1 },
      { code: 'G', libelle: 'Gramme', facteurReference: 0.001 },
      { code: 'PC', libelle: 'Pièce', facteurReference: 1 },
      { code: 'L', libelle: 'Litre', facteurReference: 1 },
      { code: 'ML', libelle: 'Millilitre', facteurReference: 0.001 },
      { code: 'CARTON', libelle: 'Carton', facteurReference: 1 },
    ];

    for (const item of data) {
      const exists = await this.uniteRepo.findOne({
        where: { code: item.code },
      });

      if (!exists) {
        await this.uniteRepo.save(
          this.uniteRepo.create({
            ...item,
            actif: true,
          }),
        );
      }
    }

    console.log('✔ Unités initialisées');
  }

  async seedFamilles() {
    const data = [
      {
        nom: 'Matières premières',
        type: TypeFamille.ARTICLE,
        description: 'Articles achetables utilisés en production',
      },
      {
        nom: 'Emballages',
        type: TypeFamille.ARTICLE,
        description: 'Articles d’emballage',
      },
      {
        nom: 'Produits finis',
        type: TypeFamille.FICHE_TECHNIQUE,
        description: 'Fiches techniques vendues',
      },
      {
        nom: 'Menus / Packs',
        type: TypeFamille.FICHE_TECHNIQUE,
        description: 'Assemblages de produits finis',
      },
    ];

    for (const item of data) {
      const exists = await this.familleRepo.findOne({
        where: {
          nom: item.nom,
          type: item.type,
        },
      });

      if (!exists) {
        await this.familleRepo.save(
          this.familleRepo.create({
            ...item,
          }),
        );
      }
    }

    console.log('✔ Familles initialisées');
  }

  async seedAllergenes() {
    const data = [
      { nom: 'Gluten', description: 'Blé, seigle, orge, avoine' },
      { nom: 'Œufs', description: 'Œufs et produits à base d’œufs' },
      { nom: 'Lait', description: 'Lait et produits laitiers' },
      {
        nom: 'Arachides',
        description: 'Arachides et produits à base d’arachides',
      },
      { nom: 'Fruits à coque', description: 'Noix, amandes, noisettes, etc.' },
      { nom: 'Soja', description: 'Soja et produits à base de soja' },
      { nom: 'Poisson', description: 'Poissons et produits à base de poisson' },
      {
        nom: 'Crustacés',
        description: 'Crustacés et produits à base de crustacés',
      },
    ];

    for (const item of data) {
      const exists = await this.allergeneRepo.findOne({
        where: { nom: item.nom },
      });

      if (!exists) {
        await this.allergeneRepo.save(
          this.allergeneRepo.create({
            ...item,
            actif: true,
          }),
        );
      }
    }

    console.log('✔ Allergènes initialisés');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LieuStockage } from './entities/lieu-stockage.entity';
import { ZoneStockage } from './entities/zone-stockage.entity';
import { CreateLieuStockageDto } from './dto/create-lieu-stockage.dto';
import { CreateZoneStockageDto } from './dto/create-zone-stockage.dto';

@Injectable()
export class StockageService {
  constructor(
    @InjectRepository(LieuStockage)
    private readonly lieuRepo: Repository<LieuStockage>,

    @InjectRepository(ZoneStockage)
    private readonly zoneRepo: Repository<ZoneStockage>,
  ) {}

  createLieu(dto: CreateLieuStockageDto) {
    return this.lieuRepo.save(
      this.lieuRepo.create({
        nom: dto.nom,
        description: dto.description ?? '',
        actif: dto.actif ?? true,
      }),
    );
  }

  findAllLieux() {
    return this.lieuRepo.find({
      relations: ['zones'],
      order: { id: 'DESC' },
    });
  }

  async removeLieu(id: number) {
    const item = await this.lieuRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Lieu introuvable');

    await this.lieuRepo.remove(item);
    return { message: 'Lieu supprimé', id };
  }

  async createZone(dto: CreateZoneStockageDto) {
    const lieu = await this.lieuRepo.findOne({
      where: { id: dto.lieuStockageId },
    });

    if (!lieu) throw new NotFoundException('Lieu introuvable');

    return this.zoneRepo.save(
      this.zoneRepo.create({
        nom: dto.nom,
        description: dto.description ?? '',
        actif: dto.actif ?? true,
        lieuStockage: lieu,
      }),
    );
  }

  findAllZones() {
    return this.zoneRepo.find({
      relations: ['lieuStockage'],
      order: { id: 'DESC' },
    });
  }

  async removeZone(id: number) {
    const item = await this.zoneRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Zone introuvable');

    await this.zoneRepo.remove(item);
    return { message: 'Zone supprimée', id };
  }
}
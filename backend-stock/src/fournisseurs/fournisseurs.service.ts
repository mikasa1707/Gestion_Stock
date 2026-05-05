import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Fournisseur } from './entities/fournisseur.entity';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';

@Injectable()
export class FournisseursService {
  constructor(
    @InjectRepository(Fournisseur)
    private readonly repo: Repository<Fournisseur>,
  ) {}

  create(dto: CreateFournisseurDto) {
    return this.repo.save(
      this.repo.create({
        ...dto,
        actif: dto.actif ?? true,
      }),
    );
  }

  findAll() {
    return this.repo.find({
      relations: ['articles'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['articles'],
    });

    if (!item) throw new NotFoundException('Fournisseur introuvable');

    return item;
  }

  async update(id: number, dto: UpdateFournisseurDto) {
    const item = await this.findOne(id);

    Object.assign(item, dto);

    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);

    return { message: 'Fournisseur supprimé', id };
  }
}
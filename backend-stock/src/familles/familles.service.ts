import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Famille } from './entities/famille.entity';
import { CreateFamilleDto } from './dto/create-famille.dto';

@Injectable()
export class FamillesService {
  constructor(@InjectRepository(Famille) private repo: Repository<Famille>) {}

  create(dto: CreateFamilleDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Famille introuvable');
    return item;
  }

  async update(id: number, dto: Partial<CreateFamilleDto>) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { message: 'Famille supprimée', id };
  }
}
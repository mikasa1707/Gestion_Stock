import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unite } from './entities/unite.entity';
import { CreateUniteDto } from './dto/create-unite.dto';

@Injectable()
export class UnitesService {
  constructor(@InjectRepository(Unite) private repo: Repository<Unite>) {}

  create(dto: CreateUniteDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Unité introuvable');
    return item;
  }

  async update(id: number, dto: Partial<CreateUniteDto>) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { message: 'Unité supprimée', id };
  }
}
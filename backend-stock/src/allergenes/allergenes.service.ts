import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allergene } from './entities/allergene.entity';
import { CreateAllergeneDto } from './dto/create-allergene.dto';

@Injectable()
export class AllergenesService {
  constructor(@InjectRepository(Allergene) private repo: Repository<Allergene>) {}

  create(dto: CreateAllergeneDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Allergène introuvable');
    return item;
  }

  async update(id: number, dto: Partial<CreateAllergeneDto>) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { message: 'Allergène supprimé', id };
  }
}
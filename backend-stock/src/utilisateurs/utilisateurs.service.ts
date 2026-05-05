import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly repo: Repository<Utilisateur>,
  ) {}

  async create(dto: CreateUtilisateurDto) {
    const utilisateur = this.repo.create({
      ...dto,
      motDePasse: await bcrypt.hash(dto.motDePasse, 10),
    });

    const saved = await this.repo.save(utilisateur);
    const { motDePasse, ...result } = saved;
    return saved;
  }

  findAll() {
    return this.repo.find({
      select: ['id', 'nom', 'email', 'profil', 'actif', 'createdAt', 'updatedAt'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const utilisateur = await this.repo.findOne({
      where: { id },
      select: ['id', 'nom', 'email', 'profil', 'actif', 'createdAt', 'updatedAt'],
    });

    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');
    return utilisateur;
  }

  async findByEmailWithPassword(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUtilisateurDto) {
    const utilisateur = await this.repo.findOne({ where: { id } });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');

    Object.assign(utilisateur, dto);

    if (dto.motDePasse) {
      utilisateur.motDePasse = await bcrypt.hash(dto.motDePasse, 10);
    }

    const saved = await this.repo.save(utilisateur);
    const { motDePasse, ...result } = saved;
    return saved;
  }

  async remove(id: number) {
    const utilisateur = await this.repo.findOne({ where: { id } });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');

    await this.repo.remove(utilisateur);
    return { message: 'Utilisateur supprimé', id };
  }
}
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AllergenesService } from './allergenes.service';
import { CreateAllergeneDto } from './dto/create-allergene.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilsGuard } from '../auth/guards/profils.guard';
import { Profils } from '../auth/decorators/profils.decorator';
import { ProfilUtilisateur } from '../utilisateurs/entities/utilisateur.entity';

@UseGuards(JwtAuthGuard, ProfilsGuard)
@Controller('allergenes')
export class AllergenesController {
  constructor(private readonly service: AllergenesService) {}

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Post()
  create(@Body() dto: CreateAllergeneDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateAllergeneDto>) {
    return this.service.update(id, dto);
  }

  @Profils(ProfilUtilisateur.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
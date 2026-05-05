import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { FamillesService } from './familles.service';
import { CreateFamilleDto } from './dto/create-famille.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilsGuard } from '../auth/guards/profils.guard';
import { Profils } from '../auth/decorators/profils.decorator';
import { ProfilUtilisateur } from '../utilisateurs/entities/utilisateur.entity';

@UseGuards(JwtAuthGuard, ProfilsGuard)
@Controller('familles')
export class FamillesController {
  constructor(private readonly service: FamillesService) {}

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Post()
  create(@Body() dto: CreateFamilleDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateFamilleDto>) {
    return this.service.update(id, dto);
  }

  @Profils(ProfilUtilisateur.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
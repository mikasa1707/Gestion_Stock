import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UnitesService } from './unites.service';
import { CreateUniteDto } from './dto/create-unite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilsGuard } from '../auth/guards/profils.guard';
import { Profils } from '../auth/decorators/profils.decorator';
import { ProfilUtilisateur } from '../utilisateurs/entities/utilisateur.entity';

@UseGuards(JwtAuthGuard, ProfilsGuard)
@Controller('unites')
export class UnitesController {
  constructor(private readonly service: UnitesService) {}

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Post()
  create(@Body() dto: CreateUniteDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateUniteDto>) {
    return this.service.update(id, dto);
  }

  @Profils(ProfilUtilisateur.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
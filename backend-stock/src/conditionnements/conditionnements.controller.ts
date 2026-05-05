import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ConditionnementsService } from './conditionnements.service';
import { CreateConditionnementDto } from './dto/create-conditionnement.dto';
import { UpdateConditionnementDto } from './dto/update-conditionnement.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilsGuard } from '../auth/guards/profils.guard';
import { Profils } from '../auth/decorators/profils.decorator';
import { ProfilUtilisateur } from '../utilisateurs/entities/utilisateur.entity';

import { CreateConditionnementProduitDto } from './dto/create-conditionnement-produit.dto';
import { UpdateConditionnementProduitDto } from './dto/update-conditionnement-produit.dto';
import { CreateConditionnementUtilisationDto } from './dto/create-conditionnement-utilisation.dto';

@UseGuards(JwtAuthGuard, ProfilsGuard)
@Controller('conditionnements')
export class ConditionnementsController {
  constructor(private readonly service: ConditionnementsService) {}

  // @Get()
  // findAll() {
  //   return this.service.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.findOne(id);
  // }

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Post()
  create(@Body() dto: CreateConditionnementDto) {
    return this.service.create(dto);
  }

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConditionnementDto,
  ) {
    return this.service.update(id, dto);
  }

  @Profils(ProfilUtilisateur.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get('produits')
  findAllProduits() {
    return this.service.findAllProduits();
  }

  @Get('produits/:id')
  findProduit(@Param('id', ParseIntPipe) id: number) {
    return this.service.findProduit(id);
  }

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Post('produits')
  createProduit(@Body() dto: CreateConditionnementProduitDto) {
    return this.service.createProduit(dto);
  }

  @Profils(ProfilUtilisateur.ADMIN, ProfilUtilisateur.RESPONSABLE_STOCK)
  @Patch('produits/:id')
  updateProduit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConditionnementProduitDto,
  ) {
    return this.service.updateProduit(id, dto);
  }

  @Profils(ProfilUtilisateur.ADMIN)
  @Delete('produits/:id')
  removeProduit(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeProduit(id);
  }

  @Post('produits/upsert')
  upsert(@Body() dto: CreateConditionnementProduitDto) {
    return this.service.upsertConditionnement(dto);
  }

  @Get('produits/article/:id')
  findByArticle(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByArticle(id);
  }

  @Post('utilisations')
  addUtilisation(@Body() dto: CreateConditionnementUtilisationDto) {
    return this.service.addUtilisation(dto);
  }

  @Get('produits/:id/utilisations')
  findUtilisationsByProduit(@Param('id', ParseIntPipe) id: number) {
    return this.service.findUtilisationsByProduit(id);
  }

  @Delete('utilisations/:id')
  removeUtilisation(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeUtilisation(id);
  }
}

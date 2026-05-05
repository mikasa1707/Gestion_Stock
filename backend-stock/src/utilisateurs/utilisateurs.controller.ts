import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateursService } from './utilisateurs.service';
import { ProfilUtilisateur } from './entities/utilisateur.entity';

@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly service: UtilisateursService) {}

  @Post()
  create(@Body() dto: CreateUtilisateurDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUtilisateurDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // @Post('init-admin')
  // createAdmin() {
  //   return this.service.create({
  //     nom: 'Admin',
  //     email: 'admin@test.com',
  //     motDePasse: '123456',
  //     profil: ProfilUtilisateur.ADMIN,
  //     actif: true,
  //   });
  // }
}

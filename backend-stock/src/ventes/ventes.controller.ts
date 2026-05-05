import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { VentesService } from './ventes.service';
import { CreateVenteDto } from './dto/create-vente.dto';

@Controller('ventes')
export class VentesController {
  constructor(private readonly service: VentesService) {}

  @Post()
  create(@Body() dto: CreateVenteDto) {
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
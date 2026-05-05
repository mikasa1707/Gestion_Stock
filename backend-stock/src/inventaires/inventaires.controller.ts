import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { InventairesService } from './inventaires.service';
import { CreateInventaireDto } from './dto/create-inventaire.dto';

@Controller('inventaires')
export class InventairesController {
  constructor(private readonly service: InventairesService) {}

  @Post()
  create(@Body() dto: CreateInventaireDto) {
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
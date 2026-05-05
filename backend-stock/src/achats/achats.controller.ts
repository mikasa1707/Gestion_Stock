import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { AchatsService } from './achats.service';
import { CreateAchatDto } from './dto/create-achat.dto';

@Controller('achats')
export class AchatsController {
  constructor(private readonly service: AchatsService) {}

  @Post()
  create(@Body() dto: CreateAchatDto) {
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
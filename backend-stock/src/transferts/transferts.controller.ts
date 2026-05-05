import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TransfertsService } from './transferts.service';
import { CreateTransfertDto } from './dto/create-transfert.dto';

@Controller('transferts')
export class TransfertsController {
  constructor(private readonly service: TransfertsService) {}

  @Post()
  create(@Body() dto: CreateTransfertDto) {
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
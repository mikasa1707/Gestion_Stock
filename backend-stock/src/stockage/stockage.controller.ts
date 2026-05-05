import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StockageService } from './stockage.service';
import { CreateLieuStockageDto } from './dto/create-lieu-stockage.dto';
import { CreateZoneStockageDto } from './dto/create-zone-stockage.dto';

@Controller('stockage')
export class StockageController {
  constructor(private readonly service: StockageService) {}

  @Post('lieux')
  createLieu(@Body() dto: CreateLieuStockageDto) {
    return this.service.createLieu(dto);
  }

  @Get('lieux')
  findAllLieux() {
    return this.service.findAllLieux();
  }

  @Delete('lieux/:id')
  removeLieu(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeLieu(id);
  }

  @Post('zones')
  createZone(@Body() dto: CreateZoneStockageDto) {
    return this.service.createZone(dto);
  }

  @Get('zones')
  findAllZones() {
    return this.service.findAllZones();
  }

  @Delete('zones/:id')
  removeZone(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeZone(id);
  }
}
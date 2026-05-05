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

import { ArticleFournisseursService } from './article-fournisseurs.service';
import { CreateArticleFournisseurDto } from './dto/create-article-fournisseur.dto';
import { UpdateArticleFournisseurDto } from './dto/update-article-fournisseur.dto';

@Controller('article-fournisseurs')
export class ArticleFournisseursController {
  constructor(private readonly service: ArticleFournisseursService) {}

  @Post()
  create(@Body() dto: CreateArticleFournisseurDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('article/:id')
  findByArticle(@Param('id', ParseIntPipe) id: number) {
    return this.service.findByArticle(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleFournisseurDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
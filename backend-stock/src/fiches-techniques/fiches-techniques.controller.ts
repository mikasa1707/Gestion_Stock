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

import { FichesTechniquesService } from './fiches-techniques.service';
import { CreateFicheTechniqueDto } from './dto/create-fiche-technique.dto';
import { UpdateFicheTechniqueDto } from './dto/update-fiche-technique.dto';
import { CreateCompositionDto } from './dto/create-composition.dto';

@Controller('fiches-techniques')
export class FichesTechniquesController {
  constructor(private readonly service: FichesTechniquesService) {}

  @Post()
  create(@Body() dto: CreateFicheTechniqueDto) {
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
    @Body() dto: UpdateFicheTechniqueDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post('compositions')
  addComposition(@Body() dto: CreateCompositionDto) {
    return this.service.addComposition(dto);
  }

  @Get(':id/compositions')
  findCompositions(@Param('id', ParseIntPipe) id: number) {
    return this.service.findCompositionsByFiche(id);
  }

  @Delete('compositions/:id')
  removeComposition(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeComposition(id);
  }

  @Get(':id/cout')
  calculerCout(@Param('id', ParseIntPipe) id: number) {
    return this.service.calculerCout(id);
  }

  @Patch('compositions/:id')
  updateComposition(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      quantite?: number;
      conditionnementUtilisationId?: number;
    },
  ) {
    return this.service.updateComposition(id, body);
  }
}

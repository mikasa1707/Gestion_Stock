import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateMouvementDto } from './dto/create-mouvement.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get('mouvements')
  findAllMouvements() {
    return this.service.findAllMouvements();
  }

  @Post('mouvements')
  mouvement(@Body() dto: CreateMouvementDto) {
    return this.service.mouvement(dto);
  }

  @Get('article/:id')
  getStockArticle(@Param('id', ParseIntPipe) id: number) {
    return this.service.getStockArticle(id);
  }

  @Post('sortie-ft')
  sortieFt(
    @Body()
    dto: {
      ficheTechniqueId: number;
      quantite: number;
      lieuStockageId: number;
      zoneStockageId: number;
    },
  ) {
    return this.service.sortieFicheTechnique(
      Number(dto.ficheTechniqueId),
      Number(dto.quantite),
      Number(dto.lieuStockageId),
      Number(dto.zoneStockageId),
    );
  }
}

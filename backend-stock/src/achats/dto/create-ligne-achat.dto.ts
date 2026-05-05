import { IsNumber } from 'class-validator';

export class CreateLigneAchatDto {
  @IsNumber()
  achatId!: number;

  @IsNumber()
  articleId!: number;

  @IsNumber()
  quantite!: number;

  @IsNumber()
  prixUnitaire!: number;

  @IsNumber()
  lieuStockageId!: number;

  @IsNumber()
  zoneStockageId!: number;
}

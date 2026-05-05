import { IsNumber, IsOptional } from 'class-validator';

export class CreateLigneInventaireDto {
  @IsNumber()
  inventaireId!: number;

  @IsOptional()
  @IsNumber()
  articleId?: number;

  @IsOptional()
  @IsNumber()
  ficheTechniqueId?: number;

  @IsNumber()
  lieuStockageId!: number;

  @IsNumber()
  zoneStockageId!: number;

  @IsNumber()
  quantiteTheorique!: number;

  @IsNumber()
  quantiteReelle!: number;
}
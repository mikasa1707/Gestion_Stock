import { IsNumber, IsOptional } from 'class-validator';

export class CreateLigneTransfertDto {
  @IsNumber()
  transfertId!: number;

  @IsOptional()
  @IsNumber()
  articleId?: number;

  @IsOptional()
  @IsNumber()
  ficheTechniqueId?: number;

  @IsNumber()
  lieuSourceId!: number;

  @IsNumber()
  zoneSourceId!: number;

  @IsNumber()
  lieuDestinationId!: number;

  @IsNumber()
  zoneDestinationId!: number;

  @IsNumber()
  quantite!: number;
}
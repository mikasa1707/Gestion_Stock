import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TypeMouvementStock } from '../entities/mouvement-stock.entity';

export class CreateMouvementDto {
  @IsEnum(TypeMouvementStock)
  typeMouvement!: TypeMouvementStock;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  articleId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ficheTechniqueId?: number;

  @Type(() => Number)
  @IsNumber()
  lieuStockageId!: number;

  @Type(() => Number)
  @IsNumber()
  zoneStockageId!: number;

  @Type(() => Number)
  @IsNumber()
  quantite!: number;

  @Type(() => Number)
  @IsNumber()
  uniteId!: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}
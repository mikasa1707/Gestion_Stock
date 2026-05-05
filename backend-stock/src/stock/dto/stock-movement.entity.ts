import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  MouvementStock,
  TypeMouvementStock,
} from '../entities/mouvement-stock.entity';

export class CreateStockMovementDto {
  @IsEnum(TypeMouvementStock)
  type!: TypeMouvementStock;

  @IsEnum(MouvementStock)
  source!: MouvementStock;

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
  quantite!: number;

  @Type(() => Number)
  @IsNumber()
  uniteId!: number;

  @IsOptional()
  @IsString()
  referenceDocument?: string;

  @IsOptional()
  @IsString()
  commentaire?: string;
}
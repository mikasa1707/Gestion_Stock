import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TypeConditionnementUtilisation } from '../entities/conditionnement-utilisation.entity';

export class CreateConditionnementUtilisationDto {
  @Type(() => Number)
  @IsNumber()
  conditionnementProduitId!: number;

  @Type(() => Number)
  @IsNumber()
  quantite!: number;

  @Type(() => Number)
  @IsNumber()
  uniteId!: number;

  @IsEnum(TypeConditionnementUtilisation)
  type!: TypeConditionnementUtilisation;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
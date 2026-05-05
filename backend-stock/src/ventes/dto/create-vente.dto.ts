import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateVenteLigneDto {
  @Type(() => Number)
  @IsNumber()
  ficheTechniqueId!: number;

  @Type(() => Number)
  @IsNumber()
  quantite!: number;

  @Type(() => Number)
  @IsNumber()
  prixUnitaire!: number;
}

export class CreateVenteDto {
  @IsString()
  reference!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVenteLigneDto)
  lignes!: CreateVenteLigneDto[];
}
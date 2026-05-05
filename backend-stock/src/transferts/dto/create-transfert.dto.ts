import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateTransfertLigneDto {
  @Type(() => Number)
  @IsNumber()
  articleId!: number;

  @Type(() => Number)
  @IsNumber()
  quantite!: number;

  @Type(() => Number)
  @IsNumber()
  uniteId!: number;

  @Type(() => Number)
  @IsNumber()
  lieuSourceId!: number;

  @Type(() => Number)
  @IsNumber()
  zoneSourceId!: number;

  @Type(() => Number)
  @IsNumber()
  lieuDestinationId!: number;

  @Type(() => Number)
  @IsNumber()
  zoneDestinationId!: number;
}

export class CreateTransfertDto {
  @IsString()
  reference!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransfertLigneDto)
  lignes!: CreateTransfertLigneDto[];
}
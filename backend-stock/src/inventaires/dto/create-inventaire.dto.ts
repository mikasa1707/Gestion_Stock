import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateInventaireLigneDto {
  @Type(() => Number)
  @IsNumber()
  articleId!: number;

  @Type(() => Number)
  @IsNumber()
  quantiteComptee!: number;

  @Type(() => Number)
  @IsNumber()
  uniteId!: number;
}

export class CreateInventaireDto {
  @IsString()
  reference!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInventaireLigneDto)
  lignes!: CreateInventaireLigneDto[];
}
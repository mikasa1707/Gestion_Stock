import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateAchatLigneDto {
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
  prixUnitaire!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  articleFournisseurId?: number;
}

export class CreateAchatDto {
  @IsString()
  reference!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  fournisseur?: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAchatLigneDto)
  lignes!: CreateAchatLigneDto[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fournisseurId?: number;
}

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleFournisseurDto {
  @Type(() => Number)
  @IsNumber()
  articleId!: number;

  @Type(() => Number)
  @IsNumber()
  fournisseurId!: number;

  @Type(() => Number)
  @IsNumber()
  prixAchat!: number;

  @Type(() => Number)
  @IsNumber()
  uniteId!: number;

  @IsOptional()
  @IsString()
  referenceFournisseur?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  delaiLivraisonJours?: number;

  @IsOptional()
  @IsBoolean()
  fournisseurPrincipal?: boolean;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TypeConditionnementProduit } from '../entities/conditionnement-produit.entity';

export class CreateConditionnementProduitDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  articleId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ficheTechniqueId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantiteAchat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  uniteAchatId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantiteInventaire?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  uniteInventaireId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantiteFt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  uniteFtId?: number;

  @IsEnum(TypeConditionnementProduit)
  type!: TypeConditionnementProduit;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
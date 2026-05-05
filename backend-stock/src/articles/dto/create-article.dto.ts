import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  reference?: string;

  @IsString()
  @IsNotEmpty()
  nom?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  uniteId!: number;

  @IsOptional()
  @IsNumber()
  familleId?: number;

  @IsOptional()
  @IsArray()
  allergeneIds?: number[];

  @IsOptional()
  @IsNumber()
  prixAchat?: number;

  @IsOptional()
  @IsNumber()
  seuilMinimum?: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;

  @IsOptional()
  @IsNumber()
  uniteSeuilMinimumId?: number;

  @IsOptional()
  @IsNumber()
  fournisseurId?: number;
}

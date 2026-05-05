import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFicheTechniqueDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  uniteId!: number;

  @IsOptional()
  @IsNumber()
  familleId?: number;

  @IsOptional()
  @IsNumber()
  prixVente?: number;

  @IsOptional()
  @IsNumber()
  seuilMinimum?: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;

  @IsOptional()
  @IsNumber()
  uniteSeuilMinimumId?: number;
}

import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TypeFamille } from '../entities/famille.entity';

export class CreateFamilleDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsEnum(TypeFamille)
  type!: TypeFamille;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
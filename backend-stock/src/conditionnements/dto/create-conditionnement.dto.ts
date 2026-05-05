import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TypeConditionnement } from '../entities/conditionnement.entity';

export class CreateConditionnementDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsNumber()
  quantite!: number;

  @IsNumber()
  uniteId!: number;

  @IsEnum(TypeConditionnement)
  type!: TypeConditionnement;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateZoneStockageDto {
  @IsString()
  nom!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  lieuStockageId!: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
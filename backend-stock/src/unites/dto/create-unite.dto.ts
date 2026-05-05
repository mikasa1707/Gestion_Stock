import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUniteDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  libelle!: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
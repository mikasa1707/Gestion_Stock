import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAllergeneDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateFournisseurDto {
  @IsString()
  nom!: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
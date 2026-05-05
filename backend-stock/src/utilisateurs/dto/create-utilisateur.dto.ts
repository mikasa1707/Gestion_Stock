import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProfilUtilisateur } from '../entities/utilisateur.entity';

export class CreateUtilisateurDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  motDePasse!: string;

  @IsEnum(ProfilUtilisateur)
  profil!: ProfilUtilisateur;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
import { SetMetadata } from '@nestjs/common';
import { ProfilUtilisateur } from '../../utilisateurs/entities/utilisateur.entity';

export const PROFILS_KEY = 'profils';

export const Profils = (...profils: ProfilUtilisateur[]) =>
  SetMetadata(PROFILS_KEY, profils);
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROFILS_KEY } from '../decorators/profils.decorator';
import { ProfilUtilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Injectable()
export class ProfilsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const profilsRequis = this.reflector.getAllAndOverride<ProfilUtilisateur[]>(
      PROFILS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!profilsRequis || profilsRequis.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !profilsRequis.includes(user.profil)) {
      throw new ForbiddenException('Accès refusé pour ce profil');
    }

    return true;
  }
}
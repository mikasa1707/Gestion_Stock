import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UtilisateursService } from '../utilisateurs/utilisateurs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilisateursService: UtilisateursService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const utilisateur =
      await this.utilisateursService.findByEmailWithPassword(dto.email);

    if (!utilisateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!utilisateur.actif) {
      throw new BadRequestException('Compte désactivé');
    }

    const passwordOk = await bcrypt.compare(
      dto.motDePasse,
      utilisateur.motDePasse,
    );

    if (!passwordOk) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = {
      sub: utilisateur.id,
      email: utilisateur.email,
      profil: utilisateur.profil,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        profil: utilisateur.profil,
      },
    };
  }
}
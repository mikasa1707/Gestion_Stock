import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilsGuard } from '../auth/guards/profils.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'stock_secret_2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtAuthGuard, ProfilsGuard],
  exports: [JwtModule, JwtAuthGuard, ProfilsGuard],
})
export class SecurityModule {}
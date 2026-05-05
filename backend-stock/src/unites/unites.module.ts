import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unite } from './entities/unite.entity';
import { UnitesController } from './unites.controller';
import { UnitesService } from './unites.service';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Unite])],
  controllers: [UnitesController],
  providers: [UnitesService],
  exports: [UnitesService],
})
export class UnitesModule {}
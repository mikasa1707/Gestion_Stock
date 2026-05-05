import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergene } from './entities/allergene.entity';
import { AllergenesController } from './allergenes.controller';
import { AllergenesService } from './allergenes.service';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Allergene])],
  controllers: [AllergenesController],
  providers: [AllergenesService],
  exports: [AllergenesService],
})
export class AllergenesModule {}
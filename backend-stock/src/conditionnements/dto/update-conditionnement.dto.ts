import { PartialType } from '@nestjs/mapped-types';
import { CreateConditionnementDto } from './create-conditionnement.dto';

export class UpdateConditionnementDto extends PartialType(CreateConditionnementDto) {}
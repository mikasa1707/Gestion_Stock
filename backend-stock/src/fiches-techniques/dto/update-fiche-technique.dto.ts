import { PartialType } from '@nestjs/mapped-types';
import { CreateFicheTechniqueDto } from './create-fiche-technique.dto';

export class UpdateFicheTechniqueDto extends PartialType(CreateFicheTechniqueDto) {}
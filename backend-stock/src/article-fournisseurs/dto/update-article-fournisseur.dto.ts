import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleFournisseurDto } from './create-article-fournisseur.dto';

export class UpdateArticleFournisseurDto extends PartialType(
  CreateArticleFournisseurDto,
) {}
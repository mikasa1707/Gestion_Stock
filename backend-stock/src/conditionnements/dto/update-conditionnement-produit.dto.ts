import { PartialType } from '@nestjs/mapped-types';
import { CreateConditionnementProduitDto } from './create-conditionnement-produit.dto';

export class UpdateConditionnementProduitDto extends PartialType(CreateConditionnementProduitDto) {}
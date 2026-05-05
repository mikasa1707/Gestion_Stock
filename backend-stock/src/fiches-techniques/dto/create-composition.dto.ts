import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompositionDto {
  @IsNumber()
  @IsNotEmpty()
  ficheTechniqueId!: number;

  @IsOptional()
  @IsNumber()
  articleId?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  ficheTechniqueComposantId?: number;

  @Type(() => Number)
  @IsNumber()
  conditionnementUtilisationId!: number;

  @IsNumber()
  @IsNotEmpty()
  quantite!: number;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { FicheTechnique } from './fiche-technique.entity';
import { ConditionnementUtilisation } from 'src/conditionnements/entities/conditionnement-utilisation.entity';

@Entity('compositions_fiches_techniques')
export class CompositionFicheTechnique {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => FicheTechnique, { nullable: false })
  @JoinColumn({ name: 'fiche_technique_id' })
  ficheTechnique!: FicheTechnique;

  @ManyToOne(() => Article, { nullable: true })
  @JoinColumn({ name: 'article_id' })
  article!: Article | null;

  @ManyToOne(() => FicheTechnique, { nullable: true })
  @JoinColumn({ name: 'fiche_technique_composant_id' })
  ficheTechniqueComposant!: FicheTechnique | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 1 })
  quantite!: number;

  @ManyToOne(() => ConditionnementUtilisation, { nullable: false })
  @JoinColumn({ name: 'conditionnement_utilisation_id' })
  conditionnementUtilisation!: ConditionnementUtilisation;
}

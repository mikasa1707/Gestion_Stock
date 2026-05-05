import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { FicheTechnique } from '../../fiches-techniques/entities/fiche-technique.entity';
import { Unite } from '../../unites/entities/unite.entity';
import { ConditionnementUtilisation } from './conditionnement-utilisation.entity';

export enum TypeConditionnementProduit {
  ARTICLE = 'ARTICLE',
  FICHE_TECHNIQUE = 'FICHE_TECHNIQUE',
}

@Entity('conditionnements_produits')
export class ConditionnementProduit {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Article, { nullable: true })
  @JoinColumn({ name: 'article_id' })
  article!: Article | null;

  @OneToOne(() => FicheTechnique, { nullable: true })
  @JoinColumn({ name: 'fiche_technique_id' })
  ficheTechnique!: FicheTechnique | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 1 })
  quantiteAchat!: number;

  @ManyToOne(() => Unite, { nullable: true })
  @JoinColumn({ name: 'unite_achat_id' })
  uniteAchat!: Unite | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 1 })
  quantiteInventaire!: number;

  @ManyToOne(() => Unite, { nullable: true })
  @JoinColumn({ name: 'unite_inventaire_id' })
  uniteInventaire!: Unite | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 1 })
  quantiteFt!: number;

  @ManyToOne(() => Unite, { nullable: true })
  @JoinColumn({ name: 'unite_ft_id' })
  uniteFt!: Unite | null;

  @Column({
    type: 'enum',
    enum: TypeConditionnementProduit,
  })
  type!: TypeConditionnementProduit;

  @Column({ default: true })
  actif!: boolean;

  @OneToMany(
    () => ConditionnementUtilisation,
    (utilisation) => utilisation.conditionnementProduit,
  )
  utilisations!: ConditionnementUtilisation[];
}

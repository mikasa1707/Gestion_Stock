import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Unite } from '../../unites/entities/unite.entity';
import { Famille } from '../../familles/entities/famille.entity';
import { Allergene } from '../../allergenes/entities/allergene.entity';
import { ConditionnementProduit } from '../../conditionnements/entities/conditionnement-produit.entity';
import { Fournisseur } from '../../fournisseurs/entities/fournisseur.entity';
import { ArticleFournisseur } from '../../article-fournisseurs/entities/article-fournisseur.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  reference!: string;

  @Column()
  nom!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Unite, { nullable: false })
  unite!: Unite;

  @ManyToOne(() => Famille, { nullable: true })
  famille!: Famille | null;

  @ManyToMany(() => Allergene)
  @JoinTable({
    name: 'articles_allergenes',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'allergene_id', referencedColumnName: 'id' },
  })
  allergenes!: Allergene[];

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  prixAchat!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  seuilMinimum!: number;

  @Column({ default: true })
  actif!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(
    () => ConditionnementProduit,
    (conditionnement) => conditionnement.article,
  )
  conditionnement!: ConditionnementProduit;

  @ManyToOne(() => Unite, { nullable: true })
  @JoinColumn({ name: 'unite_seuil_minimum_id' })
  uniteSeuilMinimum!: Unite | null;

  @ManyToOne(() => Fournisseur, { nullable: true })
  @JoinColumn({ name: 'fournisseur_id' })
  fournisseur!: Fournisseur | null;

  @OneToMany(() => ArticleFournisseur, (af) => af.article)
  fournisseurs!: ArticleFournisseur[];
}

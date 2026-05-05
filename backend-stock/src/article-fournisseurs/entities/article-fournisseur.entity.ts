import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Article } from '../../articles/entities/article.entity';
import { Fournisseur } from '../../fournisseurs/entities/fournisseur.entity';
import { Unite } from '../../unites/entities/unite.entity';

@Entity('article_fournisseurs')
export class ArticleFournisseur {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Article, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;

  @ManyToOne(() => Fournisseur, { nullable: false })
  @JoinColumn({ name: 'fournisseur_id' })
  fournisseur!: Fournisseur;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  prixAchat!: number;

  @ManyToOne(() => Unite, { nullable: false })
  @JoinColumn({ name: 'unite_id' })
  unite!: Unite;

  @Column({ nullable: true })
  referenceFournisseur!: string;

  @Column({ type: 'int', nullable: true })
  delaiLivraisonJours!: number | null;

  @Column({ default: false })
  fournisseurPrincipal!: boolean;

  @Column({ default: true })
  actif!: boolean;
}
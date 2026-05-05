import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Achat } from './achat.entity';
import { Article } from '../../articles/entities/article.entity';
import { Unite } from '../../unites/entities/unite.entity';
import { ArticleFournisseur } from 'src/article-fournisseurs/entities/article-fournisseur.entity';

@Entity('achat_lignes')
export class AchatLigne {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Achat, (achat) => achat.lignes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'achat_id' })
  achat!: Achat;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({ name: 'article_id' })
  article!: Article;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantite!: number;

  @ManyToOne(() => Unite, { nullable: false })
  @JoinColumn({ name: 'unite_id' })
  unite!: Unite;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  prixUnitaire!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  montant!: number;

  @ManyToOne(() => ArticleFournisseur, { nullable: true })
  @JoinColumn({ name: 'article_fournisseur_id' })
  articleFournisseur!: ArticleFournisseur | null;
}

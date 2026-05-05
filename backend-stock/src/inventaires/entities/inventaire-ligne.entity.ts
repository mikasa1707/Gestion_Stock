import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Inventaire } from './inventaire.entity';
import { Article } from '../../articles/entities/article.entity';
import { Unite } from '../../unites/entities/unite.entity';

@Entity('inventaire_lignes')
export class InventaireLigne {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Inventaire, (inventaire) => inventaire.lignes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventaire_id' })
  inventaire!: Inventaire;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({ name: 'article_id' })
  article!: Article;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantiteComptee!: number;

  @ManyToOne(() => Unite, { nullable: false })
  @JoinColumn({ name: 'unite_id' })
  unite!: Unite;
}
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import { Article } from '../../articles/entities/article.entity';
import { FicheTechnique } from '../../fiches-techniques/entities/fiche-technique.entity';
import { LieuStockage } from '../../stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from '../../stockage/entities/zone-stockage.entity';
import { Unite } from '../../unites/entities/unite.entity';

export enum TypeMouvementStock {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
  INVENTAIRE = 'INVENTAIRE',
}

@Entity('mouvements_stock')
export class MouvementStock {
  @PrimaryGeneratedColumn()
  id!: number;

  // 🔹 Type mouvement
  @Column({
    type: 'enum',
    enum: TypeMouvementStock,
  })
  typeMouvement!: TypeMouvementStock;

  // 🔹 Article ou FT
  @ManyToOne(() => Article, { nullable: true })
  @JoinColumn({ name: 'article_id' })
  article!: Article | null;

  @ManyToOne(() => FicheTechnique, { nullable: true })
  @JoinColumn({ name: 'fiche_technique_id' })
  ficheTechnique!: FicheTechnique | null;

  // 🔹 Lieu / zone
  @ManyToOne(() => LieuStockage, { nullable: false })
  @JoinColumn({ name: 'lieu_stockage_id' })
  lieuStockage!: LieuStockage;

  @ManyToOne(() => ZoneStockage, { nullable: false })
  @JoinColumn({ name: 'zone_stockage_id' })
  zoneStockage!: ZoneStockage;

  // 🔹 Quantité entrée utilisateur
  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantite!: number;

  @ManyToOne(() => Unite, { nullable: false })
  @JoinColumn({ name: 'unite_id' })
  unite!: Unite;

  // 🔥 🔥 🔥 IMPORTANT (conversion)
  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantiteReference!: number;

  @ManyToOne(() => Unite, { nullable: false })
  @JoinColumn({ name: 'unite_reference_id' })
  uniteReference!: Unite;

  // 🔹 Meta
  @Column({ type: 'varchar', length: 255, nullable: true })
  commentaire!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
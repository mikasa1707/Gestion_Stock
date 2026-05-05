import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Transfert } from './transfert.entity';
import { Article } from '../../articles/entities/article.entity';
import { Unite } from '../../unites/entities/unite.entity';
import { LieuStockage } from '../../stockage/entities/lieu-stockage.entity';
import { ZoneStockage } from '../../stockage/entities/zone-stockage.entity';

@Entity('transfert_lignes')
export class TransfertLigne {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Transfert, (transfert) => transfert.lignes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transfert_id' })
  transfert!: Transfert;

  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({ name: 'article_id' })
  article!: Article;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantite!: number;

  @ManyToOne(() => Unite, { nullable: false })
  @JoinColumn({ name: 'unite_id' })
  unite!: Unite;

  @ManyToOne(() => LieuStockage, { nullable: false })
  @JoinColumn({ name: 'lieu_source_id' })
  lieuSource!: LieuStockage;

  @ManyToOne(() => ZoneStockage, { nullable: false })
  @JoinColumn({ name: 'zone_source_id' })
  zoneSource!: ZoneStockage;

  @ManyToOne(() => LieuStockage, { nullable: false })
  @JoinColumn({ name: 'lieu_destination_id' })
  lieuDestination!: LieuStockage;

  @ManyToOne(() => ZoneStockage, { nullable: false })
  @JoinColumn({ name: 'zone_destination_id' })
  zoneDestination!: ZoneStockage;
}
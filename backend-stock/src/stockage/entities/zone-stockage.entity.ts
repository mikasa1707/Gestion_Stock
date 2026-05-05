import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LieuStockage } from './lieu-stockage.entity';

@Entity('zones_stockage')
export class ZoneStockage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  actif!: boolean;

  @ManyToOne(() => LieuStockage, (lieu) => lieu.zones, { nullable: false })
  @JoinColumn({ name: 'lieu_stockage_id' })
  lieuStockage!: LieuStockage;
}
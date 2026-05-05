import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ZoneStockage } from './zone-stockage.entity';

@Entity('lieux_stockage')
export class LieuStockage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  actif!: boolean;

  @OneToMany(() => ZoneStockage, (zone) => zone.lieuStockage)
  zones!: ZoneStockage[];
}
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { VenteLigne } from './vente-ligne.entity';

@Entity('ventes')
export class Vente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  reference!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ nullable: true })
  client!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  montantTotal!: number;

  @Column({ type: 'text', nullable: true })
  commentaire!: string | null;

  @OneToMany(() => VenteLigne, (ligne) => ligne.vente, {
    cascade: true,
  })
  lignes!: VenteLigne[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  coutMatiere!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  marge!: number;
}

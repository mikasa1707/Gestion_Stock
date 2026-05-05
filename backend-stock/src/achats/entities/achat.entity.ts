import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AchatLigne } from './achat-ligne.entity';

@Entity('achats')
export class Achat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  reference!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ nullable: true })
  fournisseur!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  montantTotal!: number;

  @Column({ type: 'text', nullable: true })
  commentaire!: string | null;

  @OneToMany(() => AchatLigne, (ligne) => ligne.achat, {
    cascade: true,
  })
  lignes!: AchatLigne[];

  @CreateDateColumn()
  createdAt!: Date;
}
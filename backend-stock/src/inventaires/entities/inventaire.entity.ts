import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InventaireLigne } from './inventaire-ligne.entity';

@Entity('inventaires')
export class Inventaire {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  reference!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'text', nullable: true })
  commentaire!: string | null;

  @OneToMany(() => InventaireLigne, (ligne) => ligne.inventaire, {
    cascade: true,
  })
  lignes!: InventaireLigne[];

  @CreateDateColumn()
  createdAt!: Date;
}
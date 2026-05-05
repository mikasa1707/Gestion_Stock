import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransfertLigne } from './transfert-ligne.entity';

@Entity('transferts')
export class Transfert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  reference!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'text', nullable: true })
  commentaire!: string | null;

  @OneToMany(() => TransfertLigne, (ligne) => ligne.transfert, {
    cascade: true,
  })
  lignes!: TransfertLigne[];

  @CreateDateColumn()
  createdAt!: Date;
}
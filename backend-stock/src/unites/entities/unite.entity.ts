import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('unites')
export class Unite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string; // ex: KG, PC, L

  @Column()
  libelle!: string; // ex: Kilogramme, Pièce

  @Column({ default: true })
  actif!: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 6, default: 1 })
  facteurReference!: number;
}

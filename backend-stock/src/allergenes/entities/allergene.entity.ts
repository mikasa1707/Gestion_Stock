import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('allergenes')
export class Allergene {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nom!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: true })
  actif!: boolean;
}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Unite } from '../../unites/entities/unite.entity';

export enum TypeConditionnement {
  ACHAT = 'ACHAT',
  INVENTAIRE = 'INVENTAIRE',
  FT = 'FT',
  VENTE = 'VENTE',
  GENERAL = 'GENERAL',
}

@Entity('conditionnements')
export class Conditionnement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantite!: number;

  @ManyToOne(() => Unite, { nullable: false })
  unite!: Unite;

  @Column({
    type: 'enum',
    enum: TypeConditionnement,
    default: TypeConditionnement.GENERAL,
  })
  type!: TypeConditionnement;

  @Column({ default: true })
  actif!: boolean;
}
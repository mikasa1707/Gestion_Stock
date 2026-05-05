import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Unite } from '../../unites/entities/unite.entity';
import { ConditionnementProduit } from './conditionnement-produit.entity';

export enum TypeConditionnementUtilisation {
  FT = 'FT',
  VENTE = 'VENTE',
}

@Entity('conditionnement_utilisations')
export class ConditionnementUtilisation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ConditionnementProduit, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conditionnement_produit_id' })
  conditionnementProduit!: ConditionnementProduit;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 1 })
  quantite!: number;

  @ManyToOne(() => Unite, { nullable: false })
  @JoinColumn({ name: 'unite_id' })
  unite!: Unite;

  @Column({
    type: 'enum',
    enum: TypeConditionnementUtilisation,
    default: TypeConditionnementUtilisation.FT,
  })
  type!: TypeConditionnementUtilisation;

  @Column({ default: true })
  actif!: boolean;
}
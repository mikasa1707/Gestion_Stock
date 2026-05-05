import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Unite } from '../../unites/entities/unite.entity';
import { Famille } from '../../familles/entities/famille.entity';
import { ConditionnementProduit } from 'src/conditionnements/entities/conditionnement-produit.entity';

@Entity('fiches_techniques')
export class FicheTechnique {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  reference!: string;

  @Column()
  nom!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Unite, { nullable: false })
  unite!: Unite;

  @ManyToOne(() => Famille, { nullable: true })
  famille!: Famille | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  prixVente!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  seuilMinimum!: number;

  @Column({ default: true })
  actif!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(
    () => ConditionnementProduit,
    (conditionnement) => conditionnement.ficheTechnique,
  )
  conditionnement!: ConditionnementProduit;

  @ManyToOne(() => Unite, { nullable: true })
  @JoinColumn({ name: 'unite_seuil_minimum_id' })
  uniteSeuilMinimum!: Unite | null;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Vente } from './vente.entity';
import { FicheTechnique } from '../../fiches-techniques/entities/fiche-technique.entity';

@Entity('vente_lignes')
export class VenteLigne {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Vente, (vente) => vente.lignes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vente_id' })
  vente!: Vente;

  @ManyToOne(() => FicheTechnique, { nullable: false })
  @JoinColumn({ name: 'fiche_technique_id' })
  ficheTechnique!: FicheTechnique;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantite!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  prixUnitaire!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  montant!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  coutMatiere!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  marge!: number;
}

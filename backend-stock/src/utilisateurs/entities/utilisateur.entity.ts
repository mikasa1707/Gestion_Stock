import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProfilUtilisateur {
  ADMIN = 'ADMIN',
  RESPONSABLE_STOCK = 'RESPONSABLE_STOCK',
  INVENTAIRE = 'INVENTAIRE',
  ACHAT = 'ACHAT',
  VENTE = 'VENTE',
  CONSULTATION = 'CONSULTATION',
}

@Entity('utilisateurs')
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  motDePasse!: string;

  @Column({
    type: 'enum',
    enum: ProfilUtilisateur,
    default: ProfilUtilisateur.CONSULTATION,
  })
  profil!: ProfilUtilisateur;

  @Column({ default: true })
  actif!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
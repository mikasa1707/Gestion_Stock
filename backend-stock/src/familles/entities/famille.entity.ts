import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TypeFamille {
  ARTICLE = 'ARTICLE',
  FICHE_TECHNIQUE = 'FICHE_TECHNIQUE',
}

@Entity('familles')
export class Famille {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column({
    type: 'enum',
    enum: TypeFamille,
  })
  type!: TypeFamille;

  @Column({ nullable: true })
  description!: string;
}
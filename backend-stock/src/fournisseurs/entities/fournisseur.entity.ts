import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { ArticleFournisseur } from '../../article-fournisseurs/entities/article-fournisseur.entity';

@Entity('fournisseurs')
export class Fournisseur {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nom!: string;

  @Column({ nullable: true })
  contact!: string;

  @Column({ nullable: true })
  telephone!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  adresse!: string;

  @Column({ default: true })
  actif!: boolean;

  @OneToMany(() => Article, (article) => article.fournisseur)
  articles!: Article[];

  @OneToMany(() => ArticleFournisseur, (af) => af.fournisseur)
  articlesFournisseurs!: ArticleFournisseur[];
}

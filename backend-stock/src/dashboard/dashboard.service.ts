import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Article } from '../articles/entities/article.entity';
import { FicheTechnique } from '../fiches-techniques/entities/fiche-technique.entity';
import {
  MouvementStock,
  TypeMouvementStock,
} from '../stock/entities/mouvement-stock.entity';
import { Vente } from '../ventes/entities/vente.entity';
import { VenteLigne } from '../ventes/entities/vente-ligne.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(FicheTechnique)
    private readonly ftRepo: Repository<FicheTechnique>,

    @InjectRepository(MouvementStock)
    private readonly mouvementRepo: Repository<MouvementStock>,

    @InjectRepository(Vente)
    private readonly venteRepo: Repository<Vente>,

    @InjectRepository(VenteLigne)
    private readonly venteLigneRepo: Repository<VenteLigne>,
  ) {}

  async getStats() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth();

    const startDay = new Date(yyyy, mm, today.getDate(), 0, 0, 0);
    const endDay = new Date(yyyy, mm, today.getDate(), 23, 59, 59);

    const startMonth = new Date(yyyy, mm, 1, 0, 0, 0);
    const endMonth = new Date(yyyy, mm + 1, 0, 23, 59, 59);

    const [articles, fts, derniersMouvements, ventesJour, ventesMois] =
      await Promise.all([
        this.articleRepo.find({
          relations: ['unite', 'uniteSeuilMinimum', 'famille'],
        }),

        this.ftRepo.find(),

        this.mouvementRepo.find({
          relations: ['article', 'ficheTechnique', 'unite'],
          order: { id: 'DESC' },
          take: 8,
        }),

        this.venteRepo.find({
          where: { createdAt: Between(startDay, endDay) },
          relations: ['lignes'],
        }),

        this.venteRepo.find({
          where: { createdAt: Between(startMonth, endMonth) },
          relations: ['lignes'],
        }),
      ]);

    const mouvements = await this.mouvementRepo.find({
      relations: ['article', 'uniteReference'],
      order: { id: 'ASC' },
    });

    const stockParArticle = new Map<number, number>();

    for (const m of mouvements) {
      if (!m.article?.id) continue;

      const current = stockParArticle.get(m.article.id) ?? 0;
      const qte = Number(m.quantiteReference || 0);

      if (m.typeMouvement === TypeMouvementStock.ENTREE) {
        stockParArticle.set(m.article.id, current + qte);
      }

      if (m.typeMouvement === TypeMouvementStock.SORTIE) {
        stockParArticle.set(m.article.id, current - qte);
      }

      if (m.typeMouvement === TypeMouvementStock.INVENTAIRE) {
        stockParArticle.set(m.article.id, qte);
      }
    }

    const stockFaible = articles
      .map((article) => {
        const stock = stockParArticle.get(article.id) ?? 0;
        const seuil = Number(article.seuilMinimum || 0);

        return {
          id: article.id,
          reference: article.reference,
          nom: article.nom,
          stock,
          seuil,
          unite: article.unite?.code,
          famille: article.famille?.nom,
        };
      })
      .filter((x) => x.stock <= x.seuil);

    const totalVentesJour = ventesJour.reduce(
      (s, v) => s + Number(v.montantTotal || 0),
      0,
    );

    const totalVentesMois = ventesMois.reduce(
      (s, v) => s + Number(v.montantTotal || 0),
      0,
    );

    const ventesParJour = await this.getVentesParJourMois(yyyy, mm + 1);

    const coutMatiere = await this.getCoutMatiereMois(startMonth, endMonth);

    return {
      cards: {
        nombreArticles: articles.length,
        nombreFichesTechniques: fts.length,
        nombreVentesJour: ventesJour.length,
        nombreVentesMois: ventesMois.length,
        totalVentesJour,
        totalVentesMois,
        coutMatiere,
      },
      stockFaible,
      derniersMouvements,
      ventesParJour,
      ventesParFt: await this.getVentesParFt(startMonth, endMonth),
      historiqueVentesFt: await this.getHistoriqueVentesFt(
        startMonth,
        endMonth,
      ),
    };
  }

  private async getVentesParFt(start: Date, end: Date) {
    const ventes = await this.venteRepo.find({
      where: { createdAt: Between(start, end) },
      relations: ['lignes', 'lignes.ficheTechnique'],
    });

    const map = new Map<number, any>();

    for (const vente of ventes) {
      for (const ligne of vente.lignes ?? []) {
        const ft = ligne.ficheTechnique;
        if (!ft?.id) continue;

        const current = map.get(ft.id) ?? {
          ftId: ft.id,
          nom: ft.nom,
          quantite: 0,
          total: 0,
          coutMatiere: 0,
          marge: 0,
        };

        current.quantite += Number(ligne.quantite || 0);
        current.total += Number(ligne.montant || 0);
        current.coutMatiere += Number(ligne.coutMatiere || 0);
        current.marge += Number(ligne.marge || 0);

        map.set(ft.id, current);
      }
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }

  private async getHistoriqueVentesFt(start: Date, end: Date) {
    const ventes = await this.venteRepo.find({
      where: { createdAt: Between(start, end) },
      relations: ['lignes', 'lignes.ficheTechnique'],
      order: { id: 'DESC' },
    });

    const rows: any[] = [];

    for (const vente of ventes) {
      for (const ligne of vente.lignes ?? []) {
        rows.push({
          venteId: vente.id,
          reference: vente.reference,
          date: vente.date,
          client: vente.client,
          ftId: ligne.ficheTechnique?.id,
          ftNom: ligne.ficheTechnique?.nom,
          quantite: Number(ligne.quantite || 0),
          prixUnitaire: Number(ligne.prixUnitaire || 0),
          montant: Number(ligne.montant || 0),
          coutMatiere: Number(ligne.coutMatiere || 0),
          marge: Number(ligne.marge || 0),
        });
      }
    }

    return rows;
  }

  private async getVentesParJourMois(year: number, month: number) {
    const ventes = await this.venteRepo.find({
      relations: ['lignes'],
      order: { date: 'ASC' },
    });

    const result: Record<
      string,
      { date: string; nombre: number; total: number }
    > = {};

    for (const v of ventes) {
      const d = new Date(v.date);
      if (d.getFullYear() !== year || d.getMonth() + 1 !== month) continue;

      const key = v.date;

      if (!result[key]) {
        result[key] = {
          date: key,
          nombre: 0,
          total: 0,
        };
      }

      result[key].nombre += 1;
      result[key].total += Number(v.montantTotal || 0);
    }

    return Object.values(result);
  }

  private async getCoutMatiereMois(start: Date, end: Date) {
    const ventes = await this.venteRepo.find({
      where: {
        createdAt: Between(start, end),
      },
      relations: ['lignes'],
    });

    return ventes.reduce((total, vente) => {
      return (
        total +
        vente.lignes.reduce((s, ligne) => {
          return s + Number(ligne.coutMatiere || 0);
        }, 0)
      );
    }, 0);
  }
}

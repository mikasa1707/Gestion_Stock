import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Unite, UnitesService } from './unites';
import { Famille, FamillesService } from './familles';
import { Allergene, AllergenesService } from './allergenes';
import { Fournisseur } from './fournisseurs';
import { ArticleFournisseur } from './article-fournisseurs';

export interface Article {
  id?: number;
  reference: string;
  nom: string;
  description?: string;
  unite?: Unite;
  uniteId?: number | null;
  famille?: Famille | null;
  familleId?: number | null;
  allergenes?: Allergene[];
  allergeneIds?: number[];
  prixAchat?: number;
  seuilMinimum?: number;
  actif?: boolean;
  quantiteAchat?: number;
  uniteAchatId?: number | null;
  quantiteInventaire?: number;
  uniteInventaireId?: number | null;
  quantiteFt?: number;
  uniteFtId?: number | null;
  conditionnement?: {
    id: number;
    quantiteAchat: number;
    uniteAchat?: { id: number; code: string; facteurReference: number };
    quantiteInventaire: number;
    uniteInventaire?: { id: number; code: string; facteurReference: number };
    quantiteFt: number;
    uniteFt?: { id: number; code: string; facteurReference: number };
  };
  uniteSeuilMinimumId?: number | null;
  uniteSeuilMinimum?: Unite | null;
  fournisseurs?: ArticleFournisseur[];
}

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private apiUrl = 'http://localhost:3000/articles';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Article[]>(this.apiUrl);
  }

  create(data: Article) {
    return this.http.post<Article>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Article>) {
    return this.http.patch<Article>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

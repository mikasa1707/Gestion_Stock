import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ArticleFournisseur {
  id?: number;
  articleId?: number;
  fournisseurId?: number;
  prixAchat: number;
  uniteId?: number;
  referenceFournisseur?: string;
  delaiLivraisonJours?: number | null;
  fournisseurPrincipal?: boolean;
  actif?: boolean;

  article?: any;
  fournisseur?: any;
  unite?: any;
}

@Injectable({ providedIn: 'root' })
export class ArticleFournisseursService {
  private apiUrl = 'http://localhost:3000/article-fournisseurs';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<ArticleFournisseur[]>(this.apiUrl);
  }

  findByArticle(articleId: number) {
    return this.http.get<ArticleFournisseur[]>(`${this.apiUrl}/article/${articleId}`);
  }

  create(data: ArticleFournisseur) {
    return this.http.post<ArticleFournisseur>(this.apiUrl, data);
  }

  update(id: number, data: Partial<ArticleFournisseur>) {
    return this.http.patch<ArticleFournisseur>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
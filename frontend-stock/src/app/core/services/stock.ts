import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface StockMouvementPayload {
  typeMouvement: 'ENTREE' | 'SORTIE' | 'INVENTAIRE';
  articleId?: number;
  ficheTechniqueId?: number;
  lieuStockageId: number;
  zoneStockageId: number;
  quantite: number;
  uniteId: number;
  commentaire?: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = 'http://localhost:3000/stock';

  constructor(private http: HttpClient) {}

  findAllMouvements() {
    return this.http.get<any[]>(`${this.apiUrl}/mouvements`);
  }

  getStockArticle(articleId: number) {
    return this.http.get<any>(`${this.apiUrl}/article/${articleId}`);
  }

  mouvement(data: StockMouvementPayload) {
    return this.http.post<any>(`${this.apiUrl}/mouvements`, data);
  }
}
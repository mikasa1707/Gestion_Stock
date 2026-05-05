import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConditionnementsService {
  private apiUrl = 'http://localhost:3000/conditionnements';

  constructor(private http: HttpClient) {}

  findAllProduits() {
    return this.http.get<any[]>(`${this.apiUrl}/produits`);
  }

  upsert(data: any) {
    return this.http.post(`${this.apiUrl}/produits/upsert`, data);
  }

  addUtilisation(data: {
    conditionnementProduitId: number;
    quantite: number;
    uniteId: number;
    type: 'FT' | 'VENTE';
    actif?: boolean;
  }) {
    return this.http.post(`${this.apiUrl}/utilisations`, data);
  }

  findUtilisationsByProduit(conditionnementProduitId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/produits/${conditionnementProduitId}/utilisations`);
  }

  deleteUtilisation(id: number) {
    return this.http.delete(`${this.apiUrl}/utilisations/${id}`);
  }
}

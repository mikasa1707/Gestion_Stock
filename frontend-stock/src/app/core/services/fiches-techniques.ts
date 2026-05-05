import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LigneFT {
  articleId: number;
  quantite: number;
}

export interface FicheTechnique {
  id?: number;
  reference: string;
  nom: string;
  description?: string;
  uniteId: number;
  familleId?: number;
  prixVente?: number;
  actif?: boolean;
  lignes?: LigneFT[];
}

@Injectable({ providedIn: 'root' })
export class FichesTechniquesService {
  private apiUrl = 'http://localhost:3000/fiches-techniques';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<FicheTechnique[]>(this.apiUrl);
  }

  create(data: FicheTechnique) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: FicheTechnique) {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addComposition(data: {
    ficheTechniqueId: number;
    articleId?: number | null;
    ficheTechniqueComposantId?: number | null;
    conditionnementUtilisationId: number;
    quantite: number;
  }) {
    return this.http.post(`${this.apiUrl}/compositions`, data);
  }

  getCompositions(ficheTechniqueId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${ficheTechniqueId}/compositions`);
  }

  deleteComposition(id: number) {
    return this.http.delete(`${this.apiUrl}/compositions/${id}`);
  }

  calculerCout(id: number) {
    return this.http.get<{ ficheTechniqueId: number; coutTotal: number }>(
      `${this.apiUrl}/${id}/cout`,
    );
  }

  updateComposition(id: number, data: any): Observable<FicheTechnique> {
    return this.http.patch<FicheTechnique>(`${this.apiUrl}/compositions/${id}`, data);
  }
}

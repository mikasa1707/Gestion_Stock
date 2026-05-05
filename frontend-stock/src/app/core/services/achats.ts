import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AchatLignePayload {
  articleId: number;
  quantite: number;
  uniteId: number;
  prixUnitaire: number;
}

export interface AchatPayload {
  reference: string;
  date: string;
  fournisseur?: string;
  commentaire?: string;
  lignes: AchatLignePayload[];
}

@Injectable({ providedIn: 'root' })
export class AchatsService {
  private apiUrl = 'http://localhost:3000/achats';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  findOne(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: AchatPayload) {
    return this.http.post<any>(this.apiUrl, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
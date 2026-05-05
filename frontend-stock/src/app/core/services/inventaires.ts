import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface InventaireLignePayload {
  articleId: number;
  quantiteComptee: number;
  uniteId: number;
}

export interface InventairePayload {
  reference: string;
  date: string;
  commentaire?: string;
  lignes: InventaireLignePayload[];
}

@Injectable({ providedIn: 'root' })
export class InventairesService {
  private apiUrl = 'http://localhost:3000/inventaires';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(data: InventairePayload) {
    return this.http.post<any>(this.apiUrl, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
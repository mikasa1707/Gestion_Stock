import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface TransfertLignePayload {
  articleId: number;
  quantite: number;
  uniteId: number;
  lieuSourceId: number;
  zoneSourceId: number;
  lieuDestinationId: number;
  zoneDestinationId: number;
}

export interface TransfertPayload {
  reference: string;
  date: string;
  commentaire?: string;
  lignes: TransfertLignePayload[];
}

@Injectable({ providedIn: 'root' })
export class TransfertsService {
  private apiUrl = 'http://localhost:3000/transferts';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(data: TransfertPayload) {
    return this.http.post<any>(this.apiUrl, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
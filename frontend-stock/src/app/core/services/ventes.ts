import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface VenteLignePayload {
  ficheTechniqueId: number;
  quantite: number;
  prixUnitaire: number;
}

export interface VentePayload {
  reference: string;
  date: string;
  client?: string;
  commentaire?: string;
  lignes: VenteLignePayload[];
}

@Injectable({ providedIn: 'root' })
export class VentesService {
  private apiUrl = 'http://localhost:3000/ventes';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(data: VentePayload) {
    return this.http.post<any>(this.apiUrl, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
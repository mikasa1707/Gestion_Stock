import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface LieuStockage {
  id?: number;
  nom: string;
  description?: string;
  actif?: boolean;
  zones?: ZoneStockage[];
}

export interface ZoneStockage {
  id?: number;
  nom: string;
  description?: string;
  actif?: boolean;
  lieuStockageId?: number;
  lieuStockage?: LieuStockage;
}

@Injectable({ providedIn: 'root' })
export class StockageService {
  private apiUrl = 'http://localhost:3000/stockage';

  constructor(private http: HttpClient) {}

  findLieux() {
    return this.http.get<LieuStockage[]>(`${this.apiUrl}/lieux`);
  }

  createLieu(data: Partial<LieuStockage>) {
    return this.http.post<LieuStockage>(`${this.apiUrl}/lieux`, data);
  }

  deleteLieu(id: number) {
    return this.http.delete(`${this.apiUrl}/lieux/${id}`);
  }

  findZones() {
    return this.http.get<ZoneStockage[]>(`${this.apiUrl}/zones`);
  }

  createZone(data: Partial<ZoneStockage>) {
    return this.http.post<ZoneStockage>(`${this.apiUrl}/zones`, data);
  }

  deleteZone(id: number) {
    return this.http.delete(`${this.apiUrl}/zones/${id}`);
  }
}
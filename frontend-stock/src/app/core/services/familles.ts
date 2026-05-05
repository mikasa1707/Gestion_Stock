import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Famille {
  id: number;
  nom: string;
  type: 'ARTICLE' | 'FICHE_TECHNIQUE';
  description?: string;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class FamillesService {
  private apiUrl = 'http://localhost:3000/familles';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Famille[]>(this.apiUrl);
  }

  create(data: Partial<Famille>) {
    return this.http.post<Famille>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Famille>) {
    return this.http.patch<Famille>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

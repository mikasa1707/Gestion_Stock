import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Fournisseur {
  id?: number;
  nom: string;
  contact?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  actif?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FournisseursService {
  private apiUrl = 'http://localhost:3000/fournisseurs';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Fournisseur[]>(this.apiUrl);
  }

  create(data: Fournisseur) {
    return this.http.post<Fournisseur>(this.apiUrl, data);
  }

  update(id: number, data: Fournisseur) {
    return this.http.patch<Fournisseur>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
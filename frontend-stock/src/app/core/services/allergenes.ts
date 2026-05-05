import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Allergene {
  id: number;
  nom: string;
  description?: string;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class AllergenesService {
  private apiUrl = 'http://localhost:3000/allergenes';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Allergene[]>(this.apiUrl);
  }

  create(data: Partial<Allergene>) {
    return this.http.post<Allergene>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Allergene>) {
    return this.http.patch<Allergene>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

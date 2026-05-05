import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Unite {
  id: number;
  code: string;
  libelle: string;
  actif: boolean;
  facteurReference?: number;
}

@Injectable({ providedIn: 'root' })
export class UnitesService {
  private apiUrl = 'http://localhost:3000/unites';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Unite[]>(this.apiUrl);
  }

  create(data: Partial<Unite>) {
    return this.http.post<Unite>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Unite>) {
    return this.http.patch<Unite>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

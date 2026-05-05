import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(data: { email: string; motDePasse: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('utilisateur', JSON.stringify(res.utilisateur));
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    location.href = '/login';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
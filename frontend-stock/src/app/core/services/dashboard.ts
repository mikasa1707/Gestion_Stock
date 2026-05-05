import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get<any>(this.apiUrl);
  }
}
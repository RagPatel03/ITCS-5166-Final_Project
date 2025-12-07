import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`, this.getAuthHeaders());
  }

  getSummaryChart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary-chart`, this.getAuthHeaders());
  }

  getReportsChart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports-chart`, this.getAuthHeaders());
  }

  testDatabase(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test-db`, this.getAuthHeaders());
  }
}

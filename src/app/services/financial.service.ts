import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getStockData(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${symbol}`);
  }
}

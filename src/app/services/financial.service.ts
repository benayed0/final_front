import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor(private http: HttpClient) {}

  getStockData(symbol: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/stocks/${symbol}`);
  }
}

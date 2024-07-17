import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor(private http: HttpClient) {}

  getStockData(symbol: string): Observable<any> {
    const req_url = `${environment.apiUrl}/stocks/${symbol}`;
    console.log(req_url);

    return this.http.get<any>(req_url);
  }
}

import { Injectable } from '@angular/core';
import { Currency } from '../models/currency.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  endPoint: string = "common/currencies/";
  constructor(
    private http: HttpClient
  ) { }

  getCurrencies(queryString: string): Observable<PaginatedResponse<Currency>> {
    return this.http.get<PaginatedResponse<Currency>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getCurrencies2(queryString: string) {
    return this.http.get(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getCurrency(id: string): Observable<Currency> {
    return this.http.get<Currency>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createCurrency(currency: Currency): Observable<Currency> {
    return this.http.post<Currency>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, currency);
  }

  updateCurrency(id: string, currency: Currency): Observable<Currency> {
    return this.http.put<Currency>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, currency);
  }

  deleteCurrency(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }
  
}

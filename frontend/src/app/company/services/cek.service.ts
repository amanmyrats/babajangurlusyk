import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { Cek } from '../models/cek.model';

@Injectable({
  providedIn: 'root'
})
export class CekService {
  endpoint: string = `company/ceks/`;

  constructor(
    private http: HttpClient
  ) { }

  getCeks(queryString: string): Observable<PaginatedResponse<Cek>> {
    return this.http.get<PaginatedResponse<Cek>>(`${env.baseUrl}${env.apiV1}${this.endpoint}${queryString}`);
  }

  getCek(id: number): Observable<Cek> {
    return this.http.get<Cek>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  createCek(cek: Cek): Observable<Cek> {
    return this.http.post<Cek>(`${env.baseUrl}${env.apiV1}${this.endpoint}`, cek);
  }

  updateCek(id: string, cek: Cek): Observable<Cek> {
    return this.http.put<Cek>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`, cek);
  }

  deleteCek(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  getCekTypes(){
    return [
      { value: 'IN', label: 'Satyn Alyş Çegi' },
      { value: 'OUT', label: 'Satyş Çegi' },
    ];
  }

  getPartnerTypes(){
    return [
      { value: 'CLIENT', label: 'Müşderi' },
      { value: 'SUPPLIER', label: 'Telekeçi' },
    ];
  }
}

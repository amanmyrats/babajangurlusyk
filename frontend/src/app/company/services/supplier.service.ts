import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  endpoint: string = `company/suppliers/`;

  constructor(
    private http: HttpClient
  ) { }

  getSuppliers(queryString: string): Observable<PaginatedResponse<Supplier>> {
    return this.http.get<PaginatedResponse<Supplier>>(`${env.baseUrl}${env.apiV1}${this.endpoint}${queryString}`);
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${env.baseUrl}${env.apiV1}${this.endpoint}`, supplier);
  }

  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`, supplier);
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }
}

import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { Unit } from '../models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  endPoint: string = "common/units/";

  constructor(
    private http: HttpClient
  ) { }

  getUnits(queryString: string): Observable<PaginatedResponse<Unit>> {
    return this.http.get<PaginatedResponse<Unit>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getUnit(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createUnit(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, unit);
  }

  updateUnit(id: string, unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, unit);
  }

  deleteUnit(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }
  
}

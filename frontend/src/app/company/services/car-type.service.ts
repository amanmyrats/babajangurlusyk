import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CarType } from '../models/car-type.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class CarTypeService {
  endPoint: string = "company/cartypes/";
  constructor(
    private http: HttpClient
  ) { }

  getCarTypes(queryString: string): Observable<PaginatedResponse<CarType>> {
    return this.http.get<PaginatedResponse<CarType>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getCarType(id: string): Observable<CarType> {
    return this.http.get<CarType>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createCarType(carType: CarType): Observable<CarType> {
    return this.http.post<CarType>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, carType);
  }

  updateCarType(id: string, carType: CarType): Observable<CarType> {
    return this.http.put<CarType>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, carType);
  }

  deleteCarType(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

}

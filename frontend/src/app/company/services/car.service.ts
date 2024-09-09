import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  endPoint: string = "company/cars/";
  constructor(
    private http: HttpClient
  ) { }

 getCars(queryString: string): Observable<PaginatedResponse<Car>> {
    return this.http.get<PaginatedResponse<Car>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  } 

  getCar(id: string): Observable<Car> {
    return this.http.get<Car>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, car);
  }

  updateCar(id: string, car: Car): Observable<Car> {
    return this.http.put<Car>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, car);
  }

  deleteCar(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

}

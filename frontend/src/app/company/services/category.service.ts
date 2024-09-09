import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  endpoint: string = `company/categories/`;

  constructor(
    private http: HttpClient
  ) { }

  getCategories(queryString: string): Observable<PaginatedResponse<Category>> {
    return this.http.get<PaginatedResponse<Category>>(`${env.baseUrl}${env.apiV1}${this.endpoint}${queryString}`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${env.baseUrl}${env.apiV1}${this.endpoint}`, category);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

}

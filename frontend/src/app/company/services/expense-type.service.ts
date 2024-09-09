import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseType } from '../models/expense-type';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTypeService {
  endPoint: string = "company/expensetypes/";
  constructor(
    private http: HttpClient
  ) { }
  
  getExpenseTypes(queryString: string): Observable<PaginatedResponse<ExpenseType>> {
    return this.http.get<PaginatedResponse<ExpenseType>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getExpenseType(id: string): Observable<ExpenseType> {
    return this.http.get<ExpenseType>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createExpenseType(expenseType: ExpenseType): Observable<ExpenseType> {
    return this.http.post<ExpenseType>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, expenseType);
  }

  updateExpenseType(id: string, expenseType: ExpenseType): Observable<ExpenseType> {
    return this.http.put<ExpenseType>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, expenseType);
  }

  deleteExpenseType(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }
}

import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  endPoint: string = "company/expenses/";
  constructor(
    private http: HttpClient
  ) { }

  getExpenses(queryString: string): Observable<PaginatedResponse<Expense>> {
    return this.http.get<PaginatedResponse<Expense>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getExpense(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, expense);
  }

  updateExpense(id: string, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, expense);
  }

  deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }
}

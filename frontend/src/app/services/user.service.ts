import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { User } from '../models/user.model';
import { UserChangePassword } from '../models/user-change-password.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root', 
})
export class UserService {
  endpoint = 'accounts/accounts/';

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(queryString: string): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`
      ${env.baseUrl}${env.apiV1}${this.endpoint}${queryString}`);
  }

  getUser(id: string): Observable<User> { 
    return this.http.get<User>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${env.baseUrl}${env.apiV1}${this.endpoint}`, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${env.baseUrl}${env.apiV1}${this.endpoint}register/`, user);
  }
  
  activateDeactivateUser(id: string): Observable<any> {
    return this.http.post(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/activatedeactivate/`, {});
  }

  changePassword(userChangePassword: UserChangePassword): Observable<any> {
    return this.http.post(`${env.baseUrl}${env.apiV1}${this.endpoint}changepassword/`, userChangePassword);
  }
  
}

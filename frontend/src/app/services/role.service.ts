import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Role } from '../models/role.model';
import { PaginatedResponse } from '../models/paginated-response.model';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  endpoint = 'accounts/roles/';

  constructor(
    private http: HttpClient,
  ) { }

  getRoles(queryString: string): Observable<PaginatedResponse<Role>> {
    return this.http.get<PaginatedResponse<Role>>(
      `${env.baseUrl}${env.apiV1}${this.endpoint}${queryString}`);
  }

  getRole(id: string): Observable<Role> { 
    return this.http.get<Role>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${env.baseUrl}${env.apiV1}${this.endpoint}`, role);
  }

  updateRole(id: string, role: Role): Observable<Role> {
    return this.http.put<Role>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`, role);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  hasRole(roleNameToCheck: string): boolean {
    const roleNameStored = localStorage.getItem('roleName');
    const isSuperuser = localStorage.getItem('isSuperuser');
    if(isSuperuser === 'true') {
      return true;
    } 
    // role hierarchy

    // 'admin',
    // 'baslyk',
    // 'orunbasar',
    // 'isgar',

    if(roleNameToCheck === 'admin' || roleNameToCheck === 'baslyk'){
      if (
        roleNameStored === 'admin' || 
        roleNameStored === 'baslyk') {
        return true;
      }
    } 

    if (roleNameToCheck === 'orunbasar') {
      if (
        roleNameStored === 'orunbasar' || 
        roleNameStored === 'admin' || 
        roleNameStored === 'baslyk') {
        return true;
      }
    }
    
    if(roleNameToCheck === 'isgar'){
      if (
        roleNameStored === 'isgar' || 
        roleNameStored === 'admin' || 
        roleNameStored === 'baslyk' || 
        roleNameStored === 'orunbasar') {
        return true;
      }
    }

    return false;
  }

}

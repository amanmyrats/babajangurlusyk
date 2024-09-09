import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  endpoint: string = `company/clients/`;

  constructor(
    private http: HttpClient
  ) { }

  getClients(queryString: string): Observable<PaginatedResponse<Client>> {
    return this.http.get<PaginatedResponse<Client>>(`${env.baseUrl}${env.apiV1}${this.endpoint}${queryString}`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${env.baseUrl}${env.apiV1}${this.endpoint}`, client);
  }

  updateClient(id: string, client: Client): Observable<Client> {
    return this.http.put<Client>(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`, client);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endpoint}${id}/`);
  }
}

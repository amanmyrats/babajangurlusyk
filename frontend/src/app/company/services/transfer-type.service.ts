import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TransferType } from '../models/transfer-type.model';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';


@Injectable({
  providedIn: 'root'
})
export class TransferTypeService {
  endPoint: string = "company/transfertypes/";


  constructor(
    private http: HttpClient, 
  ) { }

  getTransferTypes(queryString: string): Observable<PaginatedResponse<TransferType>> {
    return this.http.get(`${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getTransferType(id: string): Observable<TransferType> {
    return this.http.get<TransferType>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createTransferType(transferType: TransferType): Observable<TransferType>  {
    return this.http.post<TransferType>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, transferType);
  }

  updateTransferType(id: string, transferType: TransferType): Observable<TransferType>  {
    return this.http.put<TransferType>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, transferType);
  }

  deleteTransferType(id: string): Observable<any>  {
    return this.http.delete<any> (`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }
  
}

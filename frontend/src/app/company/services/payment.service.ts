import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  endPoint: string = "company/payments/"

  constructor(
    private http: HttpClient,
  ) { }

  getPayments(queryString: string): Observable<PaginatedResponse<Payment>> {
    return this.http.get<PaginatedResponse<Payment>>(`${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getPayment(id: string) {
    return this.http.get(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createPayment(payment: any) {
    return this.http.post(`${env.baseUrl}${env.apiV1}${this.endPoint}`, payment);
  }

  updatePayment(id: string, payment: any) {
    return this.http.put(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, payment);
  }

  deletePayment(id: string) {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  getPaymentTypes(){
    return [
      { value: 'IN', label: 'Gelen Töleg' },
      { value: 'OUT', label: 'Giden Töleg' },
    ];
  }

  getPartnerTypes(){
    return [
      { value: 'CLIENT', label: 'Müşderi' },
      { value: 'SUPPLIER', label: 'Telekeçi' },
    ];
  }
}

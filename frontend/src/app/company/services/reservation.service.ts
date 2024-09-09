import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root', 
})
export class ReservationService {
  endPoint: string = "company/reservations/"
  constructor(
    private http: HttpClient
  ) { 
  }

  getReservations(queryString: string): Observable<PaginatedResponse<Reservation>> {
    return this.http.get<PaginatedResponse<Reservation>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, reservation);
  }

  updateReservation(id: string, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, reservation);
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  assignDriver(id: string, reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/assigndriver/`, reservation);
  }  
  
  export(queryString: string, format?: string): Observable<any> {
    const options = {
      responseType: 'blob' as 'json'  // Important for handling binary data
    };

    return this.http.get(`${env.baseUrl}${env.apiV1}${this.endPoint}export/${queryString}`, options);
  }

  handleExport(queryString: string): void {
    this.export(queryString).subscribe({
      next: (response: any) => {
        const contentType = response.type;
        const extension = this.getFileExtension('xlsx');
        const blob = new Blob([response], { type: contentType });
        const fileName = `rezervasyonlar.${extension}`;

        saveAs(blob, fileName);
      },
      error: (error: any) => {
        console.error('Export error:', error);
      }
    }
    )
  }

  private getFileExtension(format: string): string {
    switch (format.toLowerCase()) {
      case 'csv':
        return 'csv';
      case 'json':
        return 'json';
      case 'xlsx':
        return 'xlsx';
      default:
        return 'txt';
    }
  }

  import(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${env.baseUrl}${env.apiV1}${this.endPoint}import_data/`, formData);
  }

  getTransferTypes(){
    return [
      { value: 'ARR', label: 'Arrival' },
      { value: 'DEP', label: 'Departure' },
      { value: 'ARA', label: 'Ara Transfer' },
      { value: 'TUR', label: 'Tur' },
    ];
  }


}

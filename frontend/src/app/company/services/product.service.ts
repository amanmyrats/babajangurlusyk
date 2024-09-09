import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { saveAs } from 'file-saver';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  endPoint: string = "company/products/"

  constructor(
    private http: HttpClient
  ) { }

  getProducts(queryString: string): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(
      `${env.baseUrl}${env.apiV1}${this.endPoint}${queryString}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${env.baseUrl}${env.apiV1}${this.endPoint}`, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${env.baseUrl}${env.apiV1}${this.endPoint}${id}/`);
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
        const fileName = `harytlar.${extension}`;

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

}

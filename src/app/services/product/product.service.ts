import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDto } from '../../dto/ProductDto';
import { ProductFullDto } from '../../dto/ProductFullDto';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient) {}

  create(dto: ProductDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  update(id: number, dto: ProductDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, dto, { 
      params: new HttpParams().set('id', id) 
    });
  }

  deactivate(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deactivate`, null, { 
      params: new HttpParams().set('id', id) 
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, { 
      params: new HttpParams().set('id', id) 
    });
  }

  getAllByIsActive(isActive: boolean): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/active`, { 
      params: new HttpParams().set('isActive', isActive) 
    });
  }

  getByIsActive(isActive: boolean): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.apiUrl}/active/one`, { 
      params: new HttpParams().set('isActive', isActive) 
    });
  }

  getAllProductsFull(): Observable<ProductFullDto[]> {
    return this.http.get<ProductFullDto[]>(`${this.apiUrl}/all-full`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { 
      params: new HttpParams().set('id', id) 
    });
  }

  searchProducts(searchTerm: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/search`, {
      params: { searchTerm }
    });
  }
}
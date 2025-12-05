import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDto } from '../../dto/CategoryDto';
import { CategoryFullDto } from '../../dto/CategoryFullDto';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) {}

  create(dto: CategoryDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  update(id: number, dto: CategoryDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, dto, { params: new HttpParams().set('id', id) });
  }

  deactivate(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deactivate`, null, { params: new HttpParams().set('id', id) });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, { params: new HttpParams().set('id', id) });
  }

  getAllByIsActive(isActive: boolean): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.apiUrl}/active`, { params: new HttpParams().set('isActive', isActive) });
  }

  getByIsActive(isActive: boolean): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.apiUrl}/active/one`, { params: new HttpParams().set('isActive', isActive) });
  }

  getAllCategoriesFull(): Observable<CategoryFullDto[]> {
    return this.http.get<CategoryFullDto[]>(`${this.apiUrl}/all-full`);
  }
}

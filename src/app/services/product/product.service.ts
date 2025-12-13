import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDto } from '../../dto/ProductDto';
import { ProductFullDto } from '../../dto/ProductFullDto';
import { Page } from '../../dto/Pageable/Page';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient) {}

  create(dto: ProductDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  update(id: number, product: ProductDto): Observable<ProductDto> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.post<ProductDto>(`${this.apiUrl}/update`, product, { params });
  }

  getIsActive(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-active`, {
      params: { id: id.toString() }
    });
  }

  deactivate(id: number): Observable<ProductDto> {
    return this.http.post<ProductDto>(`${this.apiUrl}/activate-desactivate`, null, {
      params: { id: id.toString() }
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, { 
      params: new HttpParams().set('id', id) 
    });
  }

  getAllByIsActive(isActive: boolean, page: number = 0, size: number = 5): Observable<Page<ProductDto>> {
    const params = new HttpParams()
      .set('isActive', isActive.toString())
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<ProductDto>>(`${this.apiUrl}/active`, { params });
  }

  getByIsActive(isActive: boolean): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.apiUrl}/active/one`, { 
      params: new HttpParams().set('isActive', isActive) 
    });
  }

  getAllProductsFull(page: number = 0, size: number = 5): Observable<Page<ProductFullDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<ProductFullDto>>(`${this.apiUrl}/all-full`, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { 
      params: new HttpParams().set('id', id) 
    });
  }

  searchProducts(searchTerm: string, page: number = 0, size: number = 5): Observable<Page<ProductDto>> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<ProductDto>>(`${this.apiUrl}/search`, { params });
  }

  searchByNom(nom: string, page: number = 0, size: number = 5): Observable<Page<ProductDto>> {
    const params = new HttpParams()
      .set('nom', nom)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<ProductDto>>(`${this.apiUrl}/search/nom`, { params });
  }

  searchByCategorie(categorieName: string, page: number = 0, size: number = 5): Observable<Page<ProductDto>> {
    const params = new HttpParams()
      .set('categorieName', categorieName)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<ProductDto>>(`${this.apiUrl}/search/categorie`, { params });
  }
}
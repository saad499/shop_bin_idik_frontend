import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailDto } from '../../dto/OrderDetailDto';
import { StatusOrder } from '../../enum/StatusOrder';
import { environment } from '../../../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrdersWithDetails(page: number = 0, size: number = 5): Observable<PageResponse<OrderDetailDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<OrderDetailDto>>(`${this.apiUrl}/all-details`, { params });
  }

  getOrdersByStatus(status: StatusOrder, page: number = 0, size: number = 5): Observable<PageResponse<OrderDetailDto>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<OrderDetailDto>>(`${this.apiUrl}/search-by-status`, { params });
  }

  updateOrderStatus(numberOrder: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${numberOrder}/status`, { status });
  }

  progressOrderStatus(orderId: number): Observable<OrderDetailDto> {
    const params = new HttpParams().set('orderId', orderId.toString());
    return this.http.post<OrderDetailDto>(`${this.apiUrl}/next-status`, null, { params });
  }
}

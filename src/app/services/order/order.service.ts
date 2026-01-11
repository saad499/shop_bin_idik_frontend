import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailDto } from '../../dto/OrderDetailDto';
import { CreateOrderRequest } from '../../dto/CreateOrderRequest';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) { }

  createOrder(request: CreateOrderRequest): Observable<OrderDetailDto> {
    return this.http.post<OrderDetailDto>(`${this.baseUrl}/create`, request);
  }

  getOrderById(orderId: number): Observable<OrderDetailDto> {
    return this.http.get<OrderDetailDto>(`${this.baseUrl}/${orderId}`);
  }

  getOrdersByClient(clientId: number): Observable<OrderDetailDto[]> {
    return this.http.get<OrderDetailDto[]>(`${this.baseUrl}/client/${clientId}`);
  }
}

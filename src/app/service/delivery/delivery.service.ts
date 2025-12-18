import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryDto } from '../../dto/DeliveryDto';
import { DeliveryRequestDto } from '../../dto/DeliveryRequestDto';
import { DeliveryRequestResponseDto } from '../../dto/DeliveryRequestResponseDto';
import { Page } from '../../dto/Pageable/Page';
import { OrderClientInfoDto } from '../../dto/OrderClientInfoDto';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:8081/api/deliveries';

  constructor(private http: HttpClient) {}

  getAllDeliveries(page: number = 0, size: number = 5): Observable<Page<DeliveryDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<DeliveryDto>>(this.apiUrl, { params });
  }

  sendDeliveryRequest(request: DeliveryRequestDto): Observable<DeliveryRequestResponseDto> {
    return this.http.post<DeliveryRequestResponseDto>(`${this.apiUrl}/request`, request);
  }

  checkRequestStatus(requestId: number): Observable<DeliveryRequestResponseDto> {
    return this.http.get<DeliveryRequestResponseDto>(`${this.apiUrl}/request/${requestId}/status`);
  }

  getOrdersEnTraitement(): Observable<OrderClientInfoDto[]> {
    return this.http.get<OrderClientInfoDto[]>(`${this.apiUrl}/orders/en-traitement`);
  }
}

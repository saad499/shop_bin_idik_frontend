import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryDto } from '../../dto/DeliveryDto';
import { Page } from '../../dto/Pageable/Page';

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
}

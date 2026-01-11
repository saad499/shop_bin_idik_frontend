import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendReclamationRequest } from '../dto/SendReclamationRequest';
import { SupportDto } from '../dto/SupportDto';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private baseUrl = 'http://localhost:8081/api/support';

  constructor(private http: HttpClient) { }

  sendReclamation(request: SendReclamationRequest): Observable<SupportDto> {
    return this.http.post<SupportDto>(`${this.baseUrl}/save`, request);
  }
}

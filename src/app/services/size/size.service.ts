import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private apiUrl = 'http://localhost:8081/api/sizes';

  constructor(private http: HttpClient) {}

  deleteSize(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?id=${id}`);
  }
}
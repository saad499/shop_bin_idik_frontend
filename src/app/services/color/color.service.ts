import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = 'http://localhost:8081/api/colors';

  constructor(private http: HttpClient) {}

  deleteColor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?id=${id}`);
  }
}
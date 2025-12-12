import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8081/api/images';

  constructor(private http: HttpClient) {}

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?id=${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommercantDto } from '../../dto/CommercantDto';

@Injectable({
  providedIn: 'root'
})
export class CommercantService {
  private readonly apiUrl = 'http://localhost:8081/api/commercants';

  constructor(private http: HttpClient) {}

  getAllCommercants(): Observable<CommercantDto[]> {
    return this.http.get<CommercantDto[]>(this.apiUrl);
  }

  searchMagazinByName(nameMagazin: string): Observable<CommercantDto[]> {
    const params = new HttpParams().set('nameMagazin', nameMagazin);
    return this.http.get<CommercantDto[]>(`${this.apiUrl}/search`, { params });
  }
}

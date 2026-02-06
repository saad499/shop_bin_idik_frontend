import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LivreurDto } from '../dto/livreur.dto';

@Injectable({
  providedIn: 'root'
})
export class LivreurService {
  private apiUrl = 'http://localhost:8081/api/livreurs';

  constructor(private http: HttpClient) {}

  saveLivreur(livreur: LivreurDto): Observable<LivreurDto> {
    return this.http.post<LivreurDto>(this.apiUrl, livreur);
  }
}

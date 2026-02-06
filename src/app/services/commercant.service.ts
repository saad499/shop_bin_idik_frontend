import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommercantDTO } from '../dto/commercant.dto';

@Injectable({
  providedIn: 'root'
})
export class CommercantService {
  private apiUrl = 'http://localhost:8081/api/commercants'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  saveCommercant(commercant: CommercantDTO): Observable<CommercantDTO> {
    return this.http.post<CommercantDTO>(this.apiUrl, commercant);
  }
}

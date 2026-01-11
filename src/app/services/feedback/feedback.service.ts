import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackDto } from '../../dto/FeedbackDto';
import { AddFeedbackRequest } from '../../dto/AddFeedbackRequest';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly baseUrl = 'http://localhost:8081/api/feedback';

  constructor(private http: HttpClient) { }

  addFeedback(request: AddFeedbackRequest): Observable<FeedbackDto> {
    return this.http.post<FeedbackDto>(`${this.baseUrl}/add`, request);
  }

  getAllFeedback(): Observable<FeedbackDto[]> {
    return this.http.get<FeedbackDto[]>(`${this.baseUrl}`);
  }

  getFeedbackById(id: number): Observable<FeedbackDto> {
    return this.http.get<FeedbackDto>(`${this.baseUrl}/${id}`);
  }
}

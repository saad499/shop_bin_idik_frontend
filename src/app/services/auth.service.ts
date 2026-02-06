import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequestDto): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/login`, loginRequest);
  }

  logout() {
    // Clear any stored user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginMessage');
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('loginMessage');
  }

  setCurrentUser(message: string) {
    localStorage.setItem('loginMessage', message);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

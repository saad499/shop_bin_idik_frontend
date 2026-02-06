import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { PopupService } from '../services/popup.service';
import { LoginRequestDto } from '../dto/login-request.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  password!: string;
  showPassword: boolean = false;
  isLoading: boolean = false;
  showError: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private popupService: PopupService,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin() {
    console.log('Login method called');
    
    // Reset error state
    this.showError = false;
    
    if (this.email && this.password) {
      this.isLoading = true;
      
      const loginRequest: LoginRequestDto = {
        usernameOrEmail: this.email,
        password: this.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.authService.setCurrentUser(response.message);
          this.router.navigate(['/principal']);
        },
        error: (error) => {
          console.error('Login error:', error);
          console.log('Setting showError to true');
          this.showError = true;
          this.cdr.detectChanges(); // Manually trigger change detection
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.showError = true;
      this.cdr.detectChanges(); // Manually trigger change detection
    }
  }

  goToRegister() {
    this.router.navigate(['/principal']);
  }

  onForgotPassword() {
    console.log('Forgot password clicked');
    // Handle forgot password logic
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

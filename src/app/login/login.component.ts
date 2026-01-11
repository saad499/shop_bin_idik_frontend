import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  password!: string;
  showPassword: boolean = false;

  constructor(private router: Router) {}

  onLogin() {
    if (this.email && this.password) {
      console.log('Login attempt:', this.email);
      // Handle login logic here
      alert('Connexion réussie!');
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

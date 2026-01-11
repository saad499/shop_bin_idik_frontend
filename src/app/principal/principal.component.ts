import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

  constructor(private router: Router) {}

  navigateToClient() {
    this.router.navigate(['/inscription']);
  }

  navigateToMerchant() {
    this.router.navigate(['/inscription-commercant']);
  }

  navigateToDelivery() {
    this.router.navigate(['/inscription-delivery']);
  }

  goToWelcomePage() {
    // Navigate to welcome/landing page
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

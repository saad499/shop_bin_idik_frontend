import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  email: string = '';
  nom: string = '';
  prenom: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}

  onInscription() {
    if (this.isFormValid()) {
      console.log('Inscription attempt:', {
        email: this.email,
        nom: this.nom,
        prenom: this.prenom
      });
      alert('Inscription réussie!');
      this.router.navigate(['/login']);
    } else {
      alert('Veuillez vérifier que les mots de passe correspondent et que tous les champs sont remplis.');
    }
  }

  isFormValid(): boolean {
    return this.email.trim() !== '' && 
           this.nom.trim() !== '' && 
           this.prenom.trim() !== '' && 
           this.password.trim() !== '' && 
           this.confirmPassword.trim() !== '' && 
           this.password === this.confirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/principal']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

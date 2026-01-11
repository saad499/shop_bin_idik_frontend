import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-commercant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription-commercant.component.html',
  styleUrl: './inscription-commercant.component.css'
})
export class InscriptionCommercantComponent {
  // Section 1: Information de base
  nom: string = '';
  prenom: string = '';
  email: string = '';
  telephone: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  // Section 2: Information sur le magasin
  nomCommerce: string = '';
  categorie: string = '';
  adresseMagasin: string = '';
  ville: string = '';
  logoMagasin: File | null = null;
  descriptionMagasin: string = '';
  
  // Section 3: Détails professionnels
  numeroIdentification: string = '';
  registreCommerce: string = '';
  siteFacebook: string = '';
  
  // Section 4: Documents
  documentJustificatif: File | null = null;
  
  // Password visibility
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}

  onInscription() {
    if (this.isFormValid()) {
      console.log('Inscription commerçant:', this.getFormData());
      alert('Inscription commerçant réussie!');
      this.router.navigate(['/login']);
    } else {
      alert('Veuillez remplir tous les champs obligatoires et vérifier que les mots de passe correspondent.');
    }
  }

  isFormValid(): boolean {
    return this.nom.trim() !== '' &&
           this.prenom.trim() !== '' &&
           this.email.trim() !== '' &&
           this.telephone.trim() !== '' &&
           this.password.trim() !== '' &&
           this.confirmPassword.trim() !== '' &&
           this.password === this.confirmPassword &&
           this.nomCommerce.trim() !== '' &&
           this.categorie.trim() !== '' &&
           this.adresseMagasin.trim() !== '' &&
           this.ville.trim() !== '';
  }

  getFormData() {
    return {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      nomCommerce: this.nomCommerce,
      categorie: this.categorie,
      adresseMagasin: this.adresseMagasin,
      ville: this.ville,
      descriptionMagasin: this.descriptionMagasin,
      numeroIdentification: this.numeroIdentification,
      registreCommerce: this.registreCommerce,
      siteFacebook: this.siteFacebook
    };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoMagasin = file;
    }
  }

  onDocumentChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.documentJustificatif = file;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/principal']);
  }
}

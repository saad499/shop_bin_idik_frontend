import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription-delivery.component.html',
  styleUrl: './inscription-delivery.component.css'
})
export class InscriptionDeliveryComponent {
  // Section 1: Information de base
  nomComplet: string = '';
  adresseEmail: string = '';
  numeroTelephone: string = '';
  nomCommerce: string = '';
  motDePasse: string = '';
  confirmerMotDePasse: string = '';
  photoConducteur: File | null = null;
  
  // Section 2: Type de véhicule
  typeVehicule: string = '';
  
  // Section 3: Info véhicule
  marque: string = '';
  numeroimmatriculation: string = '';
  photoVehicule: File | null = null;
  photoCarteGrise: string = '';
  voitureOuCamion: string = '';
  numeroImmatriculationVoiture: string = '';
  photoVehicule2: File | null = null;
  photoCarteGrise2: string = '';
  photoPermis: File | null = null;
  numeroPermisConduire: string = '';

  // Password visibility
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router) {}

  onInscription() {
    if (this.isFormValid()) {
      console.log('Inscription livreur:', this.getFormData());
      alert('Inscription livreur réussie!');
      this.router.navigate(['/login']);
    } else {
      alert('Veuillez remplir tous les champs obligatoires et vérifier que les mots de passe correspondent.');
    }
  }

  isFormValid(): boolean {
    return this.nomComplet.trim() !== '' &&
           this.adresseEmail.trim() !== '' &&
           this.numeroTelephone.trim() !== '' &&
           this.motDePasse.trim() !== '' &&
           this.confirmerMotDePasse.trim() !== '' &&
           this.motDePasse === this.confirmerMotDePasse &&
           this.typeVehicule.trim() !== '';
  }

  getFormData() {
    return {
      nomComplet: this.nomComplet,
      adresseEmail: this.adresseEmail,
      numeroTelephone: this.numeroTelephone,
      nomCommerce: this.nomCommerce,
      typeVehicule: this.typeVehicule,
      marque: this.marque,
      numeroimmatriculation: this.numeroimmatriculation,
      numeroPermisConduire: this.numeroPermisConduire
    };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPhotoConducteurChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoConducteur = file;
    }
  }

  onPhotoVehiculeChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoVehicule = file;
    }
  }

  onPhotoVehicule2Change(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoVehicule2 = file;
    }
  }

  onPhotoPermisChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoPermis = file;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/principal']);
  }
}

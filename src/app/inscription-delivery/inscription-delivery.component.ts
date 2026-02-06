import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LivreurService } from '../services/livreur.service';
import { LivreurDto } from '../dto/livreur.dto';
import { TypeVehicule } from '../dto/type-vehicule.enum';
import { UserDTO } from '../dto/user.dto';

@Component({
  selector: 'app-inscription-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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

  constructor(private router: Router, private livreurService: LivreurService) {}

  onInscription() {
    if (this.isFormValid()) {
      const livreurData: LivreurDto = this.mapToLivreurDto();
      
      this.livreurService.saveLivreur(livreurData).subscribe({
        next: (savedLivreur) => {
          console.log('Livreur saved successfully:', savedLivreur);
          alert('Inscription livreur réussie!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error saving livreur:', error);
          alert('Erreur lors de l\'inscription. Veuillez réessayer.');
        }
      });
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

  private mapToLivreurDto(): LivreurDto {
    return {
      nomComplet: this.nomComplet,
      telephone: this.numeroTelephone,
      nomCommerce: this.nomCommerce || '',
      typeVehicule: this.getTypeVehicule(),
      numImmatriculation: this.numeroimmatriculation || this.numeroImmatriculationVoiture || '',
      numeroPermis: this.numeroPermisConduire || '',
      user: {
        email: this.adresseEmail,
        username: this.adresseEmail, // Use email as username
        password: this.motDePasse,
        role: 'LIVREUR'
      }
    };
  }

  private getTypeVehicule(): TypeVehicule {
    switch (this.typeVehicule.toLowerCase()) {
      case 'moto':
        return TypeVehicule.MOTO;
      case 'voiture':
        return TypeVehicule.VOITURE;
      case 'camion':
        return TypeVehicule.CAMION;
      default:
        return TypeVehicule.MOTO;
    }
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

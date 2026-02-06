import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { ClientDTO } from '../dto/client.dto';
import { UserDTO } from '../dto/user.dto';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  // Form properties
  email: string = '';
  username: string = '';
  nom: string = '';
  prenom: string = '';
  telephone: string = '';
  adresse: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Password visibility toggles
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router, private clientService: ClientService) {}

  onInscription() {
    if (this.isFormValid()) {
      const clientData = this.createClientDTO();
      
      this.clientService.saveClient(clientData).subscribe({
        next: (response) => {
          console.log('Client saved successfully:', response);
          this.router.navigate(['/customer/landing-page']);
        },
        error: (error) => {
          console.error('Error saving client:', error);
        }
      });
    }
  }

  private createClientDTO(): ClientDTO {
    return {
      user: {
        email: this.email,
        username: this.username,
        password: this.password
      } as UserDTO,
      nom: this.nom,
      prenom: this.prenom,
      telephone: this.telephone,
      adresse: this.adresse
    };
  }

  isFormValid(): boolean {
    return this.email.trim() !== '' && 
           this.username.trim() !== '' && 
           this.nom.trim() !== '' && 
           this.prenom.trim() !== '' && 
           this.telephone.trim() !== '' && 
           this.adresse.trim() !== '' && 
           this.password.trim() !== '' && 
           this.confirmPassword.trim() !== '' &&
           this.password === this.confirmPassword;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { SupportService } from '../services/support.service';
import { SendReclamationRequest } from '../dto/SendReclamationRequest';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.css'],
  host: {
    ngSkipHydration: 'true'
  }
})
export class ContactSupportComponent implements OnInit {

  // Contact form data
  contact = {
    complaintType: '',
    message: ''
  };

  // Component state
  isSubmitting = false;
  isSubmitted = false;

  // Complaint type options
  complaintTypes = [
    { value: 'technical', label: 'Problème technique' },
    { value: 'order', label: 'Problème de commande' },
    { value: 'payment', label: 'Problème de paiement' },
    { value: 'product', label: 'Problème de produit' },
    { value: 'account', label: 'Problème de compte' },
    { value: 'other', label: 'Autre' }
  ];

  constructor(
    private router: Router,
    private supportService: SupportService
  ) { }

  ngOnInit(): void {
    // Initialize component
  }

  // Form validation
  isFormValid(): boolean {
    return !!(
      this.contact.complaintType &&
      this.contact.message.trim()
    );
  }

  // Submit contact form
  submitContact(): void {
    if (!this.isFormValid()) {
      alert('Veuillez sélectionner un type de réclamation et écrire un message');
      return;
    }

    this.isSubmitting = true;

    const reclamationRequest: SendReclamationRequest = {
      typeReclamation: this.contact.complaintType,
      message: this.contact.message.trim()
    };

    this.supportService.sendReclamation(reclamationRequest).subscribe({
      next: (response) => {
        console.log('Reclamation sent successfully:', response);
        this.isSubmitting = false; // Stop submitting state BEFORE showing success
        this.isSubmitted = true;   // Show success message
        
        // Auto reset after 5 seconds
        setTimeout(() => {
          if (this.isSubmitted) { // Check if user hasn't already clicked "Nouveau message"
            this.resetForm();
          }
        }, 5000);
      },
      error: (error) => {
        console.error('Error sending reclamation:', error);
        this.isSubmitting = false;
        
        // Display detailed error message
        let errorMessage = 'Erreur lors de l\'envoi de la réclamation. Veuillez réessayer.';
        if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
        } else if (error.status >= 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
        
        alert(errorMessage);
      }
    });
  }

  // Reset form
  resetForm(): void {
    this.contact = {
      complaintType: '',
      message: ''
    };
    this.isSubmitted = false;
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/customer/landing-page']);
  }
}

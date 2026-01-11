import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedbackService } from '../services/feedback/feedback.service';
import { AddFeedbackRequest } from '../dto/AddFeedbackRequest';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  host: {
    ngSkipHydration: 'true'
  }
})
export class FeedbackComponent implements OnInit {

  // Feedback form data
  feedback = {
    rating: 0,
    comment: '',
    userName: '',
    userEmail: ''
  };

  // Component state
  isSubmitting = false;
  isSubmitted = false;
  hoveredRating = 0;

  constructor(
    private router: Router,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
    // Initialize component
  }

  // Star rating methods
  setRating(rating: number): void {
    this.feedback.rating = rating;
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  getStarClass(starIndex: number): string {
    const rating = this.hoveredRating || this.feedback.rating;
    return starIndex <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted';
  }

  // Form validation
  isFormValid(): boolean {
    return !!(
      this.feedback.rating > 0 &&
      this.feedback.comment.trim()
    );
  }

  // Submit feedback
  submitFeedback(): void {
    if (!this.isFormValid()) {
      alert('Veuillez donner une note et écrire un commentaire');
      return;
    }

    this.isSubmitting = true;

    const feedbackRequest: AddFeedbackRequest = {
      rating: this.feedback.rating,
      message: this.feedback.comment.trim()
    };

    this.feedbackService.addFeedback(feedbackRequest).subscribe({
      next: (response) => {
        console.log('Feedback submitted successfully:', response);
        this.isSubmitting = false; // Arrêter l'état de soumission AVANT d'afficher le succès
        this.isSubmitted = true;   // Afficher le message de succès
        
        // Optionnel : Reset automatique après 5 secondes
        setTimeout(() => {
          if (this.isSubmitted) { // Vérifier si l'utilisateur n'a pas déjà cliqué sur "Nouveau feedback"
            this.resetForm();
          }
        }, 5000);
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        this.isSubmitting = false;
        
        // Afficher un message d'erreur plus détaillé
        let errorMessage = 'Erreur lors de l\'envoi du feedback. Veuillez réessayer.';
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
    this.feedback = {
      rating: 0,
      comment: '',
      userName: '',
      userEmail: ''
    };
    this.isSubmitted = false;
    this.hoveredRating = 0;
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/customer/landing-page']);
  }

  goToProducts(): void {
    this.router.navigate(['/customer/product']);
  }
}

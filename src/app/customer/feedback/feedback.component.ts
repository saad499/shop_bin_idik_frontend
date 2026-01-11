import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
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

  constructor(private router: Router) { }

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
      this.feedback.comment.trim() &&
      this.feedback.userName.trim() &&
      this.feedback.userEmail.trim()
    );
  }

  // Submit feedback
  submitFeedback(): void {
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSubmitting = true;

    // TODO: Call feedback service to submit feedback
    console.log('Submitting feedback:', this.feedback);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.resetForm();
      }, 3000);
    }, 1500);
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

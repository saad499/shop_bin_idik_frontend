import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help-support.component.html',
  styleUrl: './help-support.component.css'
})
export class HelpSupportComponent {
  complaintType: string = '';
  message: string = '';

  onSubmit() {
    if (this.complaintType && this.message) {
      console.log('Complaint Type:', this.complaintType);
      console.log('Message:', this.message);
      // Handle form submission here
      alert('Votre message a été envoyé avec succès!');
      this.resetForm();
    }
  }

  resetForm() {
    this.complaintType = '';
    this.message = '';
  }
}

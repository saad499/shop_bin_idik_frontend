import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './follow-order.component.html',
  styleUrl: './follow-order.component.css'
})
export class FollowOrderComponent implements OnInit {
  
  orderSteps = [
    {
      id: 1,
      title: 'Traitement de la commande',
      description: 'Votre commande a été reçue et est en cours de traitement',
      status: 'completed',
      date: '2024-01-01 10:30'
    },
    {
      id: 2,
      title: 'Préparation de votre commande',
      description: 'Nous préparons vos articles pour l\'expédition',
      status: 'current',
      date: null
    },
    {
      id: 3,
      title: 'Livraison en cours',
      description: 'Votre commande est en route vers vous',
      status: 'pending',
      date: null
    },
    {
      id: 4,
      title: 'Livré',
      description: 'Votre commande a été livrée avec succès',
      status: 'pending',
      date: null
    }
  ];

  orderDetails = {
    orderNumber: 'CMD-2024-001234',
    orderDate: '2024-01-01',
    estimatedDelivery: '2024-01-03',
    totalAmount: 450.00,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Rue Mohammed V',
      city: 'Casablanca',
      phone: '+212 6 12 34 56 78'
    }
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Load order details from service or route params
  }

  goBackToShopping(): void {
    this.router.navigate(['/customer/product']);
  }

  contactSupport(): void {
    // Implement contact support functionality
    console.log('Contacting support...');
  }
}

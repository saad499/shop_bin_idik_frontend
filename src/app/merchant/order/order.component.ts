import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Order } from '../../dto/Order';

@Component({
  selector: 'app-merchant-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class MerchantOrderComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  orders: Order[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  ngOnInit(): void {
    this.setupSearch();
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  setupSearch(): void {
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        this.searchOrders(term);
      });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject$.next(searchTerm);
  }

  loadOrders(): void {
    // TODO: Remplacer par un appel API réel
    this.orders = this.getMockOrders();
    this.totalItems = this.orders.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  searchOrders(term: string): void {
    // TODO: Implémenter la recherche avec l'API
    console.log('Searching for:', term);
  }

  filterByStatus(): void {
    // TODO: Implémenter le filtre par statut
    console.log('Filtering by status:', this.selectedStatus);
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'EN_ATTENTE': 'bg-warning',
      'CONFIRMEE': 'bg-info',
      'EN_PREPARATION': 'bg-primary',
      'EXPEDIEE': 'bg-success',
      'LIVREE': 'bg-success',
      'ANNULEE': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'EN_PREPARATION': 'En préparation',
      'EXPEDIEE': 'Expédiée',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return statusLabels[status] || status;
  }

  validateOrder(orderId: number): void {
    if (confirm('Voulez-vous valider cette commande?')) {
      console.log('Validating order:', orderId);
      alert('Commande validée avec succès!');
    }
  }

  viewOrderDetails(orderId: number): void {
    // TODO: Ouvrir un drawer ou naviguer vers les détails
    console.log('Viewing order details:', orderId);
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    if (confirm(`Voulez-vous changer le statut de cette commande?`)) {
      // TODO: Appel API pour mettre à jour le statut
      console.log('Updating order status:', orderId, newStatus);
      alert('Statut mis à jour avec succès!');
      this.loadOrders();
    }
  }

  cancelOrder(orderId: number): void {
    if (confirm('Voulez-vous vraiment annuler cette commande?')) {
      // TODO: Appel API pour annuler la commande
      console.log('Canceling order:', orderId);
      alert('Commande annulée avec succès!');
      this.loadOrders();
    }
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Mock data - À remplacer par de vraies données API
  private getMockOrders(): Order[] {
    return [
      {
        id: 1001,
        dateCommande: new Date(),
        status: 'EN_ATTENTE',
        items: [
          {
            productId: 1,
            productName: 'T-Shirt Premium',
            productDescription: 'T-shirt en coton bio, couleur noir',
            productImage: 'assets/images/product1.jpg',
            price: 100.00,
            quantity: 3
          },
          {
            productId: 2,
            productName: 'Pantalon Chino',
            productDescription: 'Pantalon chino slim fit, couleur beige',
            productImage: 'assets/images/product2.jpg',
            price: 100.00,
            quantity: 4
          }
        ],
        totalProduits: 700.00,
        totalHT: 583.33,
        totalTaxes: 116.67,
        totalTTC: 700.00,
        clientName: 'Mohammed ALAMI',
        clientEmail: 'mohammed.alami@email.com',
        clientPhone: '+212 6 12 34 56 78',
        shippingAddress: '123 Rue principale',
        shippingCity: 'Casablanca',
        shippingZipCode: '20000'
      }
    ];
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { OrderDetailDto } from '../../dto/OrderDetailDto';
import { StatusOrder } from '../../enum/StatusOrder';
import { OrderService } from '../../service/order/order.service';

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

  orders: OrderDetailDto[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  isLoading: boolean = false;

  // Expose enum to template
  StatusOrder = StatusOrder;

  constructor(private orderService: OrderService) {}

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
    this.isLoading = true;
    
    // If a status is selected, use the filter API, otherwise get all orders
    const apiCall = this.selectedStatus 
      ? this.orderService.getOrdersByStatus(this.selectedStatus as StatusOrder, this.currentPage, this.pageSize)
      : this.orderService.getAllOrdersWithDetails(this.currentPage, this.pageSize);

    apiCall
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.orders = response.content.map(order => ({
            ...order,
            orderDate: new Date(order.orderDate)
          }));
          this.totalItems = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.isLoading = false;
          alert('Erreur lors du chargement des commandes');
        }
      });
  }

  searchOrders(term: string): void {
    // TODO: Implémenter la recherche avec l'API
    console.log('Searching for:', term);
  }

  filterByStatus(): void {
    this.currentPage = 0; // Reset to first page when filtering
    this.loadOrders();
  }

  getStatusClass(status: StatusOrder): string {
    const statusClasses: { [key in StatusOrder]: string } = {
      [StatusOrder.EN_TRAITEMENT]: 'bg-warning',
      [StatusOrder.PREPAREE]: 'bg-info',
      [StatusOrder.EXPEDIEE]: 'bg-primary',
      [StatusOrder.LIVREE]: 'bg-success'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  getStatusLabel(status: StatusOrder): string {
    const statusLabels: { [key in StatusOrder]: string } = {
      [StatusOrder.EN_TRAITEMENT]: 'En traitement',
      [StatusOrder.PREPAREE]: 'Préparée',
      [StatusOrder.EXPEDIEE]: 'Expédiée',
      [StatusOrder.LIVREE]: 'Livrée'
    };
    return statusLabels[status] || status;
  }

  validateOrder(numberOrder: number): void {
    if (confirm('Voulez-vous valider cette commande?')) {
      this.updateOrderStatus(numberOrder, StatusOrder.PREPAREE);
    }
  }

  viewOrderDetails(numberOrder: number): void {
    // TODO: Ouvrir un drawer ou naviguer vers les détails
    console.log('Viewing order details:', numberOrder);
  }

  updateOrderStatus(numberOrder: number, newStatus: StatusOrder): void {
    if (confirm(`Voulez-vous changer le statut de cette commande?`)) {
      this.orderService.updateOrderStatus(numberOrder, newStatus)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Statut mis à jour avec succès!');
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error updating order status:', error);
            alert('Erreur lors de la mise à jour du statut');
          }
        });
    }
  }

  cancelOrder(numberOrder: number): void {
    if (confirm('Voulez-vous vraiment annuler cette commande?')) {
      // TODO: Implémenter l'annulation si disponible dans l'API
      console.log('Canceling order:', numberOrder);
      alert('Fonctionnalité d\'annulation non disponible');
    }
  }

  getClientFullName(order: OrderDetailDto): string {
    return `${order.clientPrenom} ${order.clientNom}`;
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

  getDrawerWidth(): string | number {
    const width = window.innerWidth;
    if (width < 576) {
      return '100%';
    } else if (width < 768) {
      return '100%';
    } else if (width < 992) {
      return 720;
    } else if (width < 1200) {
      return 720;
    } else {
      return 800;
    }
  }
}
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  isLoading: boolean = false;

  // Expose enum to template
  StatusOrder = StatusOrder;

  expandedOrders: Set<number> = new Set<number>();

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

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

  loadOrders(page?: number): void {
    this.isLoading = true;
    
    // Use the provided page or current page
    const pageToLoad = page !== undefined ? page : this.currentPage;
    
    // Update currentPage immediately to prevent double-click issues
    this.currentPage = pageToLoad;
    
    console.log('Loading orders for page:', pageToLoad); // Debug log
    
    // If a status is selected, use the filter API, otherwise get all orders
    const apiCall = this.selectedStatus 
      ? this.orderService.getOrdersByStatus(this.selectedStatus as StatusOrder, pageToLoad, this.pageSize)
      : this.orderService.getAllOrdersWithDetails(pageToLoad, this.pageSize);

    apiCall
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Received orders:', response.content.length, 'for page:', response.number); // Debug log
          this.orders = response.content.map(order => ({
            ...order
          }));
          this.totalItems = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.number; // Confirm with response
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection
          console.log('Current page updated to:', this.currentPage); // Debug log
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
    this.loadOrders(0);
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

  progressOrder(numberOrder: number, currentStatus: StatusOrder): void {
    const nextStatusLabel = this.getNextStatusLabel(currentStatus);
    if (confirm(`Voulez-vous faire progresser cette commande vers "${nextStatusLabel}"?`)) {
      this.orderService.progressOrderStatus(numberOrder)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            alert(`Statut mis à jour avec succès vers "${this.getStatusLabel(updatedOrder.orderStatus as StatusOrder)}"!`);
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error updating order status:', error);
            alert('Erreur lors de la mise à jour du statut');
          }
        });
    }
  }

  progressOrderStatus(numberOrder: number): void {
    // Find the order to get its current status
    const order = this.orders.find(o => o.numberOrder === numberOrder);
    if (!order) {
      console.error('Order not found:', numberOrder);
      return;
    }

    // Convert string status to enum
    const currentStatus = order.orderStatus as StatusOrder;
    const nextStatusLabel = this.getNextStatusLabel(currentStatus);
    
    if (confirm(`Voulez-vous faire progresser cette commande vers "${nextStatusLabel}"?`)) {
      this.orderService.progressOrderStatus(numberOrder)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOrder) => {
            alert(`Statut mis à jour avec succès vers "${this.getStatusLabel(updatedOrder.orderStatus as StatusOrder)}"!`);
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error updating order status:', error);
            alert('Erreur lors de la mise à jour du statut');
          }
        });
    }
  }

  getNextStatusLabel(currentStatus: StatusOrder): string {
    switch (currentStatus) {
      case StatusOrder.EN_TRAITEMENT:
        return 'Préparée';
      case StatusOrder.PREPAREE:
        return 'Expédiée';
      case StatusOrder.EXPEDIEE:
        return 'Livrée';
      default:
        return '';
    }
  }

  // Keep updateOrderStatus for backward compatibility if needed
  updateOrderStatus(numberOrder: number, newStatus: StatusOrder): void {
    this.progressOrder(numberOrder, newStatus);
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

  toggleOrderDetails(orderNumber: number): void {
    if (this.expandedOrders.has(orderNumber)) {
      this.expandedOrders.delete(orderNumber);
    } else {
      this.expandedOrders.add(orderNumber);
    }
  }

  isOrderExpanded(orderNumber: number): boolean {
    return this.expandedOrders.has(orderNumber);
  }

  // Pagination methods
  goToPage(page: number): void {
    console.log('goToPage called with:', page, 'currentPage:', this.currentPage); // Debug log
    if (page >= 0 && page < this.totalPages && page !== this.currentPage && !this.isLoading) {
      this.loadOrders(page);
    } else {
      console.log('Page change prevented - already on page:', page); // Debug log
    }
  }

  previousPage(): void {
    const targetPage = this.currentPage - 1;
    console.log('previousPage called, current:', this.currentPage, 'target:', targetPage); // Debug log
    if (targetPage >= 0 && targetPage !== this.currentPage && !this.isLoading) {
      this.loadOrders(targetPage);
    }
  }

  nextPage(): void {
    const targetPage = this.currentPage + 1;
    console.log('nextPage called, current:', this.currentPage, 'target:', targetPage); // Debug log
    if (targetPage < this.totalPages && targetPage !== this.currentPage && !this.isLoading) {
      this.loadOrders(targetPage);
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

  getOrderStatusClass(orderStatus: string): string {
    return this.getStatusClass(orderStatus as StatusOrder);
  }

  getOrderStatusLabel(orderStatus: string): string {
    return this.getStatusLabel(orderStatus as StatusOrder);
  }
}
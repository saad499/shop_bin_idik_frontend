import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, interval, switchMap } from 'rxjs';
import { DeliveryDto } from '../../dto/DeliveryDto';
import { DeliveryRequestDto } from '../../dto/DeliveryRequestDto';
import { DeliveryRequestResponseDto } from '../../dto/DeliveryRequestResponseDto';
import { DeliveryService } from '../../service/delivery/delivery.service';
import { OrderClientInfoDto } from '../../dto/OrderClientInfoDto';

@Component({
  selector: 'app-merchant-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class MerchantDeliveryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  deliveries: DeliveryDto[] = [];
  driverDrawerVisible = false;
  selectedDriver: DeliveryDto | null = null;
  
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;
  
  isLoading: boolean = false;

  // Delivery request properties
  selectedContactMethod: 'MESSAGE' | 'CALL' = 'MESSAGE';
  isRequestPending: boolean = false;
  currentRequestId: number | null = null;
  requestStatus: string = '';

  ordersEnTraitement: OrderClientInfoDto[] = [];
  selectedOrder: OrderClientInfoDto | null = null;

  constructor(
    private deliveryService: DeliveryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDeliveries();
    this.loadOrdersEnTraitement();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDeliveries(page?: number): void {
    this.isLoading = true;
    const pageToLoad = page !== undefined ? page : this.currentPage;
    
    this.currentPage = pageToLoad;
  
    
    this.deliveryService.getAllDeliveries(pageToLoad, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.deliveries = response.content;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalElements;
          this.currentPage = response.number;
          this.isLoading = false;
          this.cdr.detectChanges();
          console.log('Current page updated to:', this.currentPage);
        },
        error: (error) => {
          console.error('Error loading deliveries:', error);
          this.isLoading = false;
          alert('Erreur lors du chargement des livreurs');
        }
      });
  }

  loadOrdersEnTraitement(): void {
    this.deliveryService.getOrdersEnTraitement()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.ordersEnTraitement = orders;
          console.log('orders en traitement:', orders);
        },
        error: (err) => {
          console.error('Error loading orders en traitement:', err);
        }
      });
  }

  openDriverDrawer(driver: DeliveryDto): void {
    this.selectedDriver = driver;
    this.driverDrawerVisible = true;
    document.body.style.overflow = 'hidden';
  }

  onOrderSelect(order: OrderClientInfoDto): void {
    this.selectedOrder = order;
  }

  confirmDriver(): void {
    if (!this.selectedDriver || !this.selectedOrder) {
      alert('Veuillez sélectionner une commande.');
      return;
    }

    const request: DeliveryRequestDto = {
      deliveryId: this.selectedDriver.id,
      orderId: this.selectedOrder.numberOrder,
      pickupAddress: "123 Rue Exemple, Casablanca", // Replace with actual pickup address
      deliveryAddress: "456 Avenue Test, Rabat",    // Replace with actual delivery address
      contactMethod: this.selectedContactMethod,
      estimatedPrice: 50 // Replace with actual price if available
    };
    console.log('Sending delivery request:', request);

    this.isRequestPending = true;
    this.requestStatus = 'En attente de réponse du livreur...';

    this.deliveryService.sendDeliveryRequest(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.currentRequestId = response.requestId;
          console.log('Request sent successfully:', response);
          this.startStatusPolling();
        },
        error: (error) => {
          console.error('Error sending delivery request:', error);
          this.isRequestPending = false;
          alert('Erreur lors de l\'envoi de la demande');
        }
      });
  }

  viewFullImage(imageUrl: string): void {
    if (imageUrl && imageUrl !== 'assets/images/no-image.png') {
      window.open(imageUrl, '_blank');
    }
  }

  startStatusPolling(): void {
    if (!this.currentRequestId) return;

    interval(3000) // Check every 3 seconds
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.deliveryService.checkRequestStatus(this.currentRequestId!))
      )
      .subscribe({
        next: (response) => {
          console.log('Request status:', response.status);
          
          switch (response.status) {
            case 'ACCEPTED':
              this.requestStatus = 'Livreur accepté!';
              this.isRequestPending = false;
              alert('Le livreur a accepté votre demande!');
              this.closeDriverDrawer();
              this.loadDeliveries(); // Refresh list
              this.stopStatusPolling();
              break;
              
            case 'REJECTED':
              this.requestStatus = 'Livreur a refusé';
              this.isRequestPending = false;
              alert('Le livreur a refusé votre demande. Veuillez choisir un autre livreur.');
              this.currentRequestId = null;
              this.stopStatusPolling();
              break;
              
            case 'CANCELLED':
              this.requestStatus = 'Demande annulée';
              this.isRequestPending = false;
              this.currentRequestId = null;
              this.stopStatusPolling();
              break;
              
            case 'PENDING':
              this.requestStatus = 'En attente de réponse...';
              break;
          }
          
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error checking request status:', error);
        }
      });
  }

  stopStatusPolling(): void {
    // Polling will stop automatically when component is destroyed or unsubscribed
  }

  cancelRequest(): void {
    if (confirm('Voulez-vous annuler cette demande?')) {
      this.isRequestPending = false;
      this.currentRequestId = null;
      this.requestStatus = '';
      this.closeDriverDrawer();
    }
  }

  onContactMethodChange(method: 'MESSAGE' | 'CALL'): void {
    this.selectedContactMethod = method;
  }

  closeDriverDrawer(): void {
    this.driverDrawerVisible = false;
    this.selectedDriver = null;
    this.isRequestPending = false;
    this.currentRequestId = null;
    this.requestStatus = '';
    document.body.style.overflow = '';
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage && !this.isLoading) {
      this.loadDeliveries(page);
    } else {
      console.log('Page change prevented - already on page:', page);
    }
  }

  previousPage(): void {
    const targetPage = this.currentPage - 1;
    console.log('previousPage called, current:', this.currentPage, 'target:', targetPage);
    if (targetPage >= 0 && !this.isLoading) {
      this.loadDeliveries(targetPage);
    }
  }

  nextPage(): void {
    const targetPage = this.currentPage + 1;
    console.log('nextPage called, current:', this.currentPage, 'target:', targetPage);
    if (targetPage < this.totalPages && !this.isLoading) {
      this.loadDeliveries(targetPage);
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

  getStarArray(note: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= note);
    }
    return stars;
  }

  getVehicleIcon(typeVehicule: string): string {
    const type = typeVehicule.toLowerCase();
    if (type.includes('vélo') || type.includes('velo')) return 'bicycle';
    if (type.includes('moto')) return 'scooter';
    if (type.includes('voiture')) return 'car-front';
    return 'bicycle';
  }

  getVehicleBadgeClass(typeVehicule: string): string {
    const type = typeVehicule.toLowerCase();
    if (type.includes('vélo') || type.includes('velo')) return 'bg-info';
    if (type.includes('moto')) return 'bg-warning text-dark';
    if (type.includes('voiture')) return 'bg-primary';
    return 'bg-info';
  }

  isDriverAvailable(delivery: DeliveryDto): boolean {
    const status = delivery.status?.trim().toLowerCase();
    const isAvailable = status === 'disponible';
    return isAvailable;
  }
}

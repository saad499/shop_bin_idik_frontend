import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DeliveryDto } from '../../dto/DeliveryDto';
import { DeliveryService } from '../../service/delivery/delivery.service';

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
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;
  
  isLoading: boolean = false;

  constructor(
    private deliveryService: DeliveryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDeliveries(page?: number): void {
    this.isLoading = true;
    const pageToLoad = page !== undefined ? page : this.currentPage;
    
    // Update currentPage immediately to prevent double-click issues
    this.currentPage = pageToLoad;
    
    console.log('Loading deliveries for page:', pageToLoad); // Debug log
    
    this.deliveryService.getAllDeliveries(pageToLoad, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Received deliveries:', response.content.length, 'for page:', response.number);
          // Debug: Log status values
          response.content.forEach(d => console.log('Delivery ID:', d.id, 'Status:', `"${d.status}"`));
          this.deliveries = response.content;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalElements;
          this.currentPage = response.number; // Confirm with response
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection
          console.log('Current page updated to:', this.currentPage); // Debug log
        },
        error: (error) => {
          console.error('Error loading deliveries:', error);
          this.isLoading = false;
          alert('Erreur lors du chargement des livreurs');
        }
      });
  }

  openDriverDrawer(driver: DeliveryDto): void {
    this.selectedDriver = driver;
    this.driverDrawerVisible = true;
    document.body.style.overflow = 'hidden';
  }

  closeDriverDrawer(): void {
    this.driverDrawerVisible = false;
    this.selectedDriver = null;
    document.body.style.overflow = '';
  }

  confirmDriver(): void {
    console.log('Driver confirmed:', this.selectedDriver);
    alert('Livreur confirmé avec succès!');
    this.closeDriverDrawer();
  }

  viewFullImage(imageUrl: string): void {
    if (imageUrl && imageUrl !== 'assets/images/no-image.png') {
      window.open(imageUrl, '_blank');
    }
  }

  // Pagination methods
  goToPage(page: number): void {
    console.log('goToPage called with:', page, 'currentPage:', this.currentPage); // Debug log
    if (page >= 0 && page < this.totalPages && page !== this.currentPage && !this.isLoading) {
      this.loadDeliveries(page);
    } else {
      console.log('Page change prevented - already on page:', page); // Debug log
    }
  }

  previousPage(): void {
    const targetPage = this.currentPage - 1;
    console.log('previousPage called, current:', this.currentPage, 'target:', targetPage); // Debug log
    if (targetPage >= 0 && !this.isLoading) {
      this.loadDeliveries(targetPage);
    }
  }

  nextPage(): void {
    const targetPage = this.currentPage + 1;
    console.log('nextPage called, current:', this.currentPage, 'target:', targetPage); // Debug log
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

  // Add helper method to check if driver is available
  isDriverAvailable(delivery: DeliveryDto): boolean {
    const status = delivery.status?.trim().toLowerCase();
    const isAvailable = status === 'disponible';
    console.log('Checking availability for', delivery.id, 'Status:', `"${delivery.status}"`, 'Available:', isAvailable);
    return isAvailable;
  }
}

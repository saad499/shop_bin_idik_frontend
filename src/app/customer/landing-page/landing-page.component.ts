import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CommercantService } from '../../services/commercant/commercant.service';
import { ProductActiveDto } from '../../dto/ProductActiveDto';
import { CommercantDto } from '../../dto/CommercantDto';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  sidebarCollapsed = false;
  carouselIndex = 0;
  activeProducts: ProductActiveDto[] = [];
  commercants: CommercantDto[] = [];
  productSearchTerm: string = '';
  storeSearchTerm: string = '';
  
  carouselImages = [
    'assets/images/video-games.jpg',
    'assets/images/supermarket.jpg',
    'assets/images/sport-loisir.jpg',
    'assets/images/warm-clothes.png',
    'assets/images/clot.jpg',
    'assets/images/electronics.jpg',
    'assets/images/sneakers.jpg',
    'assets/images/jouet.jpg'
  ];

  constructor(
    private productService: ProductService,
    private commercantService: CommercantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load data immediately without setTimeout
    this.loadActiveProducts();
    this.loadCommercants();
  }

  loadActiveProducts(): void {
    console.log('Loading active products...');
    // Add loading state and better error handling
    this.productService.getAllActiveProducts(0, 8).subscribe({
      next: (response) => {
        console.log('Full API Response:', JSON.stringify(response, null, 2));
        if (response && response.content) {
          this.activeProducts = response.content;
          console.log('Products loaded successfully:', this.activeProducts.length);
        } else {
          console.warn('No products found in response');
          this.activeProducts = [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Full error object:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        // Try to load again after 2 seconds if it fails
        this.activeProducts = [];
        setTimeout(() => {
          console.log('Retrying to load products...');
          this.retryLoadProducts();
        }, 2000);
        this.cdr.detectChanges();
      }
    });
  }

  retryLoadProducts(): void {
    this.productService.getAllActiveProducts(0, 8).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.activeProducts = response.content;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Retry failed:', error);
      }
    });
  }

  loadCommercants(): void {
    console.log('Loading commercants...');
    this.commercantService.getAllCommercants().subscribe({
      next: (commercants) => {
        console.log('Full commercants response:', JSON.stringify(commercants, null, 2));
        if (commercants) {
          this.commercants = commercants;
          console.log('Commercants loaded successfully:', this.commercants.length);
        } else {
          console.warn('No commercants found in response');
          this.commercants = [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Full commercants error:', error);
        this.commercants = [];
        // Retry commercants after 2 seconds
        setTimeout(() => {
          this.retryLoadCommercants();
        }, 2000);
        this.cdr.detectChanges();
      }
    });
  }

  retryLoadCommercants(): void {
    this.commercantService.getAllCommercants().subscribe({
      next: (commercants) => {
        if (commercants) {
          this.commercants = commercants;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Commercants retry failed:', error);
      }
    });
  }

  searchProducts(): void {
    if (this.productSearchTerm.trim() === '') {
      this.loadActiveProducts();
      return;
    }
    
    console.log('Searching products with term:', this.productSearchTerm);
    this.productService.searchProductActif(this.productSearchTerm, 0, 8).subscribe({
      next: (response) => {
        console.log('Search results:', response);
        this.activeProducts = response.content || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.activeProducts = [];
        this.cdr.detectChanges();
      }
    });
  }

  onProductSearchChange(event: any): void {
    this.productSearchTerm = event.target.value;
    // Debounce search
    setTimeout(() => {
      if (this.productSearchTerm === event.target.value) {
        this.searchProducts();
      }
    }, 300);
  }

  searchStores(): void {
    if (this.storeSearchTerm.trim() === '') {
      this.loadCommercants();
      return;
    }
    
    console.log('Searching stores with term:', this.storeSearchTerm);
    this.commercantService.searchMagazinByName(this.storeSearchTerm).subscribe({
      next: (commercants) => {
        console.log('Store search results:', commercants);
        this.commercants = commercants || [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error searching stores:', error);
        this.commercants = [];
        this.cdr.detectChanges();
      }
    });
  }

  onStoreSearchChange(event: any): void {
    this.storeSearchTerm = event.target.value;
    // Debounce search
    setTimeout(() => {
      if (this.storeSearchTerm === event.target.value) {
        this.searchStores();
      }
    }, 300);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  nextImage(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.carouselImages.length;
  }

  prevImage(): void {
    this.carouselIndex = this.carouselIndex === 0 
      ? this.carouselImages.length - 1 
      : this.carouselIndex - 1;
  }

  goToImage(index: number): void {
    this.carouselIndex = index;
  }
}

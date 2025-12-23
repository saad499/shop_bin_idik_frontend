import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { ProductActiveDto } from '../../dto/ProductActiveDto';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  sidebarCollapsed = false;
  carouselIndex = 0;
  activeProducts: ProductActiveDto[] = [];
  
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Always load products when component initializes
    setTimeout(() => {
      this.loadActiveProducts();
    }, 0);
  }

  loadActiveProducts(): void {
    console.log('Loading active products...');
    this.productService.getAllActiveProducts(0, 8).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.activeProducts = response.content || [];
        console.log('Active products array length:', this.activeProducts.length);
        // Force change detection
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading active products:', error);
        this.activeProducts = [];
        this.cdr.detectChanges();
      }
    });
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

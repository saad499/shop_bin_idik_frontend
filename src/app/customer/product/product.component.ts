import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { ProductActiveDto } from '../../dto/ProductActiveDto';
import { CartService } from '../../services/cart/cart.service';
import { AddToCartRequest } from '../../dto/AddToCartRequest';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  sidebarCollapsed = false;
  products: ProductActiveDto[] = [];
  searchTerm: string = '';
  currentPage = 0;
  totalPages = 1;
  pageSize = 4;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadProducts(): void {
    console.log('Loading products - Page:', this.currentPage, 'Size:', this.pageSize);
    this.productService.getAllActiveProducts(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Products response:', response);
        this.products = response.content || [];
        this.totalPages = response.totalPages || 0;
        console.log('Total pages set to:', this.totalPages);
        console.log('Current page:', this.currentPage);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.totalPages = 0;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    setTimeout(() => {
      if (this.searchTerm === event.target.value) {
        this.searchProducts();
      }
    }, 300);
  }

  searchProducts(): void {
    if (this.searchTerm.trim() === '') {
      this.currentPage = 0;
      this.loadProducts();
      return;
    }

    console.log('Searching products - Page:', this.currentPage, 'Size:', this.pageSize);
    this.productService.searchProductActif(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Search response:', response);
        this.products = response.content || [];
        this.totalPages = response.totalPages || 0;
        console.log('Total pages set to:', this.totalPages);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.products = [];
        this.totalPages = 0;
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0) {
      page = this.totalPages - 1;
    } else if (page >= this.totalPages) {
      page = 0; 
    }
    
    console.log('Going to page:', page);
    this.currentPage = page;
    if (this.searchTerm.trim() === '') {
      this.loadProducts();
    } else {
      this.searchProducts();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  addToCart(product: ProductActiveDto, imageId?: number): void {
    console.log('Add to cart clicked for:', product.nom);
    console.log('Product ID:', product.idProduct);
    console.log('Image ID:', imageId);
    
    // Validate product and required fields
    if (!product) {
      console.error('Product is null or undefined');
      alert('Erreur: Produit non valide');
      return;
    }

    // Use the correct product ID from the updated ProductActiveDto
    const productId = product.idProduct;
    
    if (!productId) {
      console.error('Product ID is missing:', product);
      alert('Erreur: ID du produit manquant');
      return;
    }

    // For colors and sizes, use default values since they're not available in ProductActiveDto
    const colorId = 1; // Default color ID
    const sizeId = 1;  // Default size ID

    const request: AddToCartRequest = {
      productId: productId,
      colorId: colorId,
      sizeId: sizeId,
      quantity: 1
    };

    console.log('Add to cart request:', request);

    const userId = 1; // This should come from authentication service

    this.cartService.addToCart(userId, request).subscribe({
      next: (cartItem) => {
        console.log('Product added to cart successfully:', cartItem);
        alert(`${product.nom} ajouté au panier avec succès!`);
        
        // Notify that cart has been updated
        this.cartService.notifyCartUpdated();
        
        // Verify the correct product was added
        if (cartItem.productName !== product.nom) {
          console.warn(`Product name mismatch - Expected: ${product.nom}, Got: ${cartItem.productName}`);
        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        
        if (error.status === 500 && error.error?.message?.includes('Product not found')) {
          alert(`Erreur: Produit "${product.nom}" non trouvé (ID: ${productId}). Vérifiez que ce produit existe dans la base de données.`);
        } else {
          alert('Erreur lors de l\'ajout au panier');
        }
      }
    });
  }

  viewDetails(product: ProductActiveDto): void {
    console.log('Viewing details for:', product);
    // TODO: Navigate to product details page
  }
}

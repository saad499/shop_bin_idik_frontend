import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CartService } from '../services/cart/cart.service';
import { CartSummaryDto } from '../dto/CartSummaryDto';
import { CartItemDto } from '../dto/CartItemDto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    NzIconModule, 
    NzDrawerModule, 
    NzButtonModule, 
    NzFormModule, 
    NzInputModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Panier properties
  showPanier = false;
  cartItems: CartItemDto[] = [];
  cartItemCount = 0;
  shippingFee = 30;
  private userId = 1;
  isLoadingCart = false;
  removingItemIds: Set<number> = new Set(); // Track which items are being removed

  // Drawer properties
  visible = false;
  categoryDrawerVisible = false;
  isAddingProduct = false;
  selectedCategory: any = null;

  constructor(
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.loadCart();
    });
    
    // Subscribe to cart updates
    this.cartService.cartUpdated$.subscribe(() => {
      console.log('Cart update notification received, reloading cart...');
      setTimeout(() => {
        this.loadCart();
      });
    });
  }

  ngOnDestroy(): void {
    // Cleanup logic here
  }

  // Load cart data from API
  loadCart(): void {
    this.isLoadingCart = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (cartSummary: CartSummaryDto) => {
        this.cartItems = cartSummary.items || [];
        this.cartItemCount = cartSummary.totalItems || 0;
        console.log('Cart loaded successfully:', cartSummary);
        this.isLoadingCart = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        // Fallback to empty cart on error
        this.cartItems = [];
        this.cartItemCount = 0;
        this.isLoadingCart = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Panier methods
  togglePanier() {
    this.showPanier = !this.showPanier;
    if (this.showPanier) {
      // Use setTimeout to prevent change detection issues
      setTimeout(() => {
        this.loadCart();
      });
    }
  }

  closePanier() {
    this.showPanier = false;
  }

  continueShopping() {
    this.showPanier = false;
    this.router.navigate(['/customer/product']);
  }

  increaseQuantity(index: number) {
    if (this.cartItems[index]) {
      const item = this.cartItems[index];
      // TODO: Call API to update quantity
      console.log('Increase quantity for:', item.productName);
      // For now, just update locally
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
      this.updateCartCount();
      this.cdr.detectChanges();
    }
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index] && this.cartItems[index].quantity > 1) {
      const item = this.cartItems[index];
      // TODO: Call API to update quantity
      console.log('Decrease quantity for:', item.productName);
      // For now, just update locally
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      this.updateCartCount();
      this.cdr.detectChanges();
    }
  }

  removeItem(index: number) {
    if (this.cartItems[index]) {
      const item = this.cartItems[index];
      const cartItemId = item.id;

      if (!cartItemId) {
        console.error('Cart item ID is missing:', item);
        alert('Erreur: ID de l\'article manquant');
        return;
      }

      // Check if this item is already being removed
      if (this.removingItemIds.has(cartItemId)) {
        return;
      }

      // Add to removing items set
      this.removingItemIds.add(cartItemId);
      this.cdr.detectChanges();

      // Call API to remove item
      this.cartService.removeCartItem(cartItemId).subscribe({
        next: () => {
          console.log('Item removed from cart successfully');
          
          // Remove from removing items set first
          this.removingItemIds.delete(cartItemId);
          
          // Reload the entire cart to ensure consistency with backend
          this.loadCart();
          
          // Notify other components that cart has been updated
          this.cartService.notifyCartUpdated();
        },
        error: (error) => {
          console.error('Error removing item from cart:', error);
          alert('Erreur lors de la suppression de l\'article du panier');
          
          // Remove from removing items set on error
          this.removingItemIds.delete(cartItemId);
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Helper method to check if specific item is being removed
  isItemBeingRemoved(itemId: number): boolean {
    return this.removingItemIds.has(itemId);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingFee;
  }

  updateCartCount() {
    this.cartItemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Drawer methods
  openDrawer() {
    this.visible = true;
  }

  closeDrawer() {
    this.visible = false;
  }

  getDrawerWidth() {
    return window.innerWidth > 768 ? 720 : '90%';
  }

  addProduct() {
    this.isAddingProduct = true;
    // Product creation logic here
    setTimeout(() => {
      this.isAddingProduct = false;
      this.closeDrawer();
    }, 2000);
  }

  navigateToProducts() {
    this.router.navigate(['/merchant/product']);
  }

  closeCategoryDrawer() {
    this.categoryDrawerVisible = false;
  }
}
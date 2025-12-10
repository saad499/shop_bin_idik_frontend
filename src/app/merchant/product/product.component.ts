import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFullDto } from '../../dto/ProductFullDto';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-merchant-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDividerModule, NzTableModule, NzSwitchModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class MerchantProductComponent implements OnInit{
  products: ProductFullDto[] = [];
  filteredProducts: ProductFullDto[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProductsFull().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  searchProduct(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredProducts = this.products;
      return;
    }
    this.filteredProducts = this.products.filter(p => 
      p.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      });
    }
  }
  deactivateProduct(id: number): void {
    this.productService.deactivate(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error deactivating product:', err);
      }
    });
  }
}

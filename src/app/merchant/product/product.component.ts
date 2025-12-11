import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFullDto } from '../../dto/ProductFullDto';
import { ProductService } from '../../services/product/product.service';
import { debounceTime, distinctUntilChanged, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductDto } from '../../dto/ProductDto';

@Component({
  selector: 'app-merchant-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDividerModule, NzTableModule, NzSwitchModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class MerchantProductComponent implements OnInit{
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();
  products: ProductFullDto[] = [];
  filteredProducts: (ProductFullDto | ProductDto)[] = [];
  searchTerm: string = '';
  isSearching: boolean = false;
  productActiveStatus: Map<number, boolean> = new Map();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadProducts();
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
        switchMap(term => {
          this.isSearching = true;
          if (!term || term.trim() === '') {
            // If empty, return all products
            return of(this.products);
          } else {
            // Call backend search API
            return this.productService.searchProducts(term);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.filteredProducts = data;
          this.isSearching = false;
        },
        error: (err) => {
          console.error('Error searching products:', err);
          this.isSearching = false;
          this.filteredProducts = this.products;
        }
      });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject$.next(searchTerm);
  }

  loadProducts(): void {
    this.productService.getAllProductsFull()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loadActiveStatus(data);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  loadActiveStatus(products: (ProductFullDto | ProductDto)[]): void {
    const requests = products.map(product => {
      const id = this.getProductId(product);
      return this.productService.getIsActive(id);
    });

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (statuses) => {
          products.forEach((product, index) => {
            const id = this.getProductId(product);
            this.productActiveStatus.set(id, statuses[index]);
          });
        },
        error: (err) => {
          console.error('Error loading active status:', err);
        }
      });
  }

  
  getProductId(product: ProductFullDto | ProductDto): number {
    if ('id' in product) {
      return (product as ProductFullDto).id;
    }
    return 0;
  }
  getCategorieName(product: ProductFullDto | ProductDto): string {
    if ('categorie' in product) {
      return (product as ProductFullDto).categorie?.nom || 'N/A';
    }
    return 'N/A';
  }

  getDateCreated(product: ProductFullDto | ProductDto): Date | string {
    if ('dateCreated' in product) {
      return (product as ProductFullDto).dateCreated || new Date();
    }
    return new Date();
  }

  searchProduct(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredProducts = this.products;
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    const term = searchTerm.toLowerCase();
    
    this.filteredProducts = this.products.filter(p => 
      p.nom.toLowerCase().includes(term) ||
      p.categorie?.nom?.toLowerCase().includes(term)
    );
    
    this.isSearching = false;
  }

  isProductActive(product: ProductFullDto | ProductDto): boolean {
    const id = this.getProductId(product);
    return this.productActiveStatus.get(id) ?? false;
  }

  toggleProductStatus(id: number): void {
    this.productService.deactivate(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Reload products to get updated status
          this.loadProducts();
          if (this.searchTerm) {
            this.searchSubject$.next(this.searchTerm);
          }
        },
        error: (err) => {
          console.error('Error toggling product status:', err);
          alert('Erreur lors du changement de statut du produit');
          // Reload to revert the checkbox state
          this.loadProducts();
        }
      });
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

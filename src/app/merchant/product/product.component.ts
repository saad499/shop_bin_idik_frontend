import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFullDto } from '../../dto/ProductFullDto';
import { ProductService } from '../../services/product/product.service';
import { debounceTime, distinctUntilChanged, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductDto } from '../../dto/ProductDto';
import { ColorDto } from '../../dto/ColorDto';
import { ProductRefreshService } from '../../services/product/product-refresh.service';
import { CategoryService } from '../../services/category/category.service';
import { CategoryFullDto } from '../../dto/CategoryFullDto';
import { StatusProduct } from '../../enum/StatusProduct';
import { SizeDto } from '../../dto/SizeDto';
import { ImageDto } from '../../dto/ImageDto';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ImageService } from '../../services/image/image.service';
import { ColorService } from '../../services/color/color.service';
import { SizeService } from '../../services/size/size.service';

@Component({
  selector: 'app-merchant-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDividerModule, NzTableModule, NzSwitchModule, NzDrawerModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class MerchantProductComponent implements OnInit{

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();
  products: (ProductFullDto | ProductDto)[] = [];
  filteredProducts: (ProductFullDto | ProductDto)[] = [];
  paginatedProducts: (ProductFullDto | ProductDto)[] = [];
  categories: CategoryFullDto[] = [];
  searchTerm: string = '';
  isSearching: boolean = false;
  productActiveStatus: Map<number, boolean> = new Map();

  // Edit drawer
  editDrawerVisible = false;
  editingProduct: ProductDto = this.getEmptyProduct();
  productImages: Array<{ file: File; preview: string; id?: number }> = [];
  sizesInput: string = '';
  colorName: string = '';
  colorCode: string = '#000000';
  isUpdating: boolean = false;
  statusProduct = StatusProduct;
   // Pagination properties
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalItems: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadProducts();
    this.loadCategories();
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
            return this.productService.getAllProductsFull(this.currentPage, this.pageSize);
          } else {
            // Call backend search API
            return this.productService.searchProducts(term, this.currentPage, this.pageSize);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (page) => {
          this.products = page.content;
          this.totalPages = page.totalPages;
          this.totalItems = page.totalElements;
          this.loadActiveStatus(page.content);
          this.isSearching = false;
        },
        error: (err) => {
          console.error('Error searching products:', err);
          this.isSearching = false;
          this.filteredProducts = this.products;
          this.updatePagination();
        }
      });
  }

  onSearchChange(searchTerm: string): void {
    this.currentPage = 0;
    this.searchSubject$.next(searchTerm);
  }

  loadProducts(): void {
    this.productService.getAllProductsFull(this.currentPage, this.pageSize)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (page) => {
          this.products = page.content;
          this.totalPages = page.totalPages;
          this.totalItems = page.totalElements;
          this.currentPage = page.number;
          this.loadActiveStatus(page.content);
        },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategoriesFull()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => console.error('Error loading categories:', err)
      });
  }

   openEditDrawer(product: ProductFullDto | ProductDto): void {
    console.log('Opening edit drawer for product:', product);
    this.editingProduct = {
      id: product.id,
      nom: product.nom,
      description: product.description,
      prix: product.prix,
      stock: product.stock,
      status: product.status,
      isActiveProduct: product.isActiveProduct,
      categorieId: 'categorie' in product ? product.categorie?.id || 0 : product.categorieId,
      sizes: product.sizes ? [...product.sizes] : [],
      colors: product.colors ? [...product.colors] : [],
      images: product.images ? [...product.images] : []
    };
    
    // Load existing images
    this.productImages = product.images && product.images.length > 0 
    ? product.images.map((img, index) => ({
        file: new File([], `existing-${index}`),
        preview: img.imageUrl,
        id: img.id
      }))
    : [];
  
    console.log('Editing product data:', this.editingProduct);
    this.editDrawerVisible = true;
    this.cdr.detectChanges();
  }

  updateProduct(): void {
    if (this.isUpdating || !this.editingProduct.id) {
      return;
    }
    
    // Validation
    if (!this.editingProduct.nom || !this.editingProduct.nom.trim()) {
      alert('Le nom du produit est obligatoire');
      return;
    }

    if (!this.editingProduct.prix || this.editingProduct.prix <= 0) {
      alert('Le prix doit être supérieur à 0');
      return;
    }

    if (!this.editingProduct.categorieId || this.editingProduct.categorieId === 0) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }
    this.editingProduct.images = this.parseImages();
    this.isUpdating = true;
    this.cdr.detectChanges();

    this.productService.update(this.editingProduct.id, this.editingProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.isUpdating = false;
            this.editDrawerVisible = false;
            this.cdr.detectChanges();
            setTimeout(() => {
              this.resetEditForm();
              this.loadProducts();
              alert('Produit modifié avec succès!');
            }, 50);
          }, 0);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        setTimeout(() => {
          this.isUpdating = false;
          this.cdr.detectChanges();
          alert('Erreur lors de la modification du produit');
        }, 0);
        }
      });
  }

  closeEditDrawer(): void {
    setTimeout(() => {
    this.editDrawerVisible = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.resetEditForm();
    }, 50);
  }, 0);
  }
  resetEditForm(): void {
    this.editingProduct = this.getEmptyProduct();
    this.sizesInput = '';
    this.colorName = '';
    this.colorCode = '#000000';
    this.productImages = [];
  }

  addSize(): void {
    if (this.sizesInput && this.sizesInput.trim() !== '') {
      const sizes = this.parseSizes(this.sizesInput);
      this.editingProduct.sizes = [...this.editingProduct.sizes, ...sizes];
      this.sizesInput = '';
    }
  }

  removeSize(index: number): void {
    const size = this.editingProduct.sizes[index];

    if (size.id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette taille?')) {
        this.sizeService.deleteSize(size.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.editingProduct.sizes.splice(index, 1);
              alert('Taille supprimée avec succès!');
            },
            error: (err) => {
              console.error('Error deleting size:', err);
              alert('Erreur lors de la suppression de la taille');
            }
          });
      }
    } else {
      // New size not yet saved - just remove from array
      this.editingProduct.sizes.splice(index, 1);
    }
  }

  parseSizes(input: string): SizeDto[] {
    return input
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(sizeName => ({ sizeName }));
  }

  // Color methods
  addColor(): void {
    if (this.colorName && this.colorCode) {
      this.editingProduct.colors.push({
        colorName: this.colorName.trim(),
        colorCode: this.colorCode
      });
      this.colorName = '';
      this.colorCode = '#000000';
    }
  }

  removeColor(index: number): void {
    const color = this.editingProduct.colors[index];
    
    // If the color has an ID, it exists in the database - call API
    if (color.id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette couleur?')) {
        this.colorService.deleteColor(color.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.editingProduct.colors.splice(index, 1);
              alert('Couleur supprimée avec succès!');
            },
            error: (err) => {
              console.error('Error deleting color:', err);
              alert('Erreur lors de la suppression de la couleur');
            }
          });
      }
    } else {
      // New color not yet saved - just remove from array
      this.editingProduct.colors.splice(index, 1);
    }
  }

  // Image methods
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productImages.push({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    const image = this.productImages[index];
    
    // If the image has an ID, it exists in the database - call API
    if (image.id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette image?')) {
        this.imageService.deleteImage(image.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.productImages.splice(index, 1);
              // Also remove from editingProduct.images
              const imgIndex = this.editingProduct.images.findIndex(img => img.id === image.id);
              if (imgIndex !== -1) {
                this.editingProduct.images.splice(imgIndex, 1);
              }
            },
            error: (err) => {
              console.error('Error deleting image:', err);
              alert('Erreur lors de la suppression de l\'image');
            }
          });
      }
    } else {
      // New image not yet saved - just remove from array
      this.productImages.splice(index, 1);
    }
  }

  parseImages(): ImageDto[] {
    return this.productImages.map(file => ({
      imageUrl: file.preview || '',
      imageData: file.preview || ''
    }));
  }

  private getEmptyProduct(): ProductDto {
    return {
      nom: '',
      description: '',
      prix: 0,
      sizes: [],
      colors: [],
      images: [],
      stock: 0,
      status: StatusProduct.ACTIF,
      isActiveProduct: true,
      categorieId: 0
    };
  }

  updatePagination(): void {
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        this.searchSubject$.next(this.searchTerm);
      } else {
        this.loadProducts();
      }
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        this.searchSubject$.next(this.searchTerm);
      } else {
        this.loadProducts();
      }
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        this.searchSubject$.next(this.searchTerm);
      } else {
        this.loadProducts();
      }
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

  loadActiveStatus(products: (ProductFullDto | ProductDto)[]): void {
    if (products.length === 0) {
      return;
    }

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
    return product.id || 0;
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

  getSizes(product: ProductFullDto | ProductDto): string {
  if (!product.sizes || product.sizes.length === 0) {
    return 'N/A';
  }
  // Extract the 'size' property from each SizeDto object
  return product.sizes.map(s => s.sizeName).join(', ');
}

  getColors(product: ProductFullDto | ProductDto): string[] {
  if (!product.colors || product.colors.length === 0) {
    return [];
  }
  // Extract the 'color' property from each ColorDto object
  return product.colors.map(c => c.colorCode);
}

  getFirstImage(product: ProductFullDto | ProductDto): string {
    if (!product.images || product.images.length === 0) {
      return 'assets/images/no-image.png';
    }
    // Get the first image URL
    return product.images[0].imageUrl || 'assets/images/no-image.png';
  }
  getColorObjects(product: ProductFullDto | ProductDto): ColorDto[] {
    if (!product.colors || product.colors.length === 0) {
      return [];
    }
    return product.colors;
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
      ('categorie' in p && p.categorie?.nom?.toLowerCase().includes(term))
    );
    
    this.isSearching = false;
  }

  isProductActive(product: ProductFullDto | ProductDto): boolean {
    const id = this.getProductId(product);
  // Lire depuis la Map: si id=1 retourne true, si id=2 retourne false
  return this.productActiveStatus.get(id) ?? false;
  }

  toggleProductStatus(id: number): void {
    this.productService.deactivate(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Reload products to get updated status
          const currentStatus = this.productActiveStatus.get(id) ?? false;
          this.productActiveStatus.set(id, !currentStatus);

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

  editProduct(product: ProductFullDto): void {
    
  }
}

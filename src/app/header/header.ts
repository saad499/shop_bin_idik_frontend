import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CategoryFullDto } from '../dto/CategoryFullDto';
import { CategoryService } from '../services/category/category.service';
import { CategoryDto } from '../dto/CategoryDto';
import { ProductDto } from '../dto/ProductDto';
import { StatusProduct } from '../enum/StatusProduct';
import { ProductService } from '../services/product/product.service';
import { Subject, takeUntil } from 'rxjs';
import { SizeDto } from '../dto/SizeDto';
import { ColorDto } from '../dto/ColorDto';
import { ImageDto } from '../dto/ImageDto';
import { ProductRefreshService } from '../services/product/product-refresh.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NzIconModule, 
    NzDrawerModule, 
    NzButtonModule, 
    NzFormModule, 
    NzInputModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {

  compareFn = (o1: any, o2: any): boolean => {
    return o1 === o2;
  };
  private destroy$ = new Subject<void>();
  
  // Drawer states
  visible = false;
  categoryDrawerVisible = false;
  
  // Loading states
  isAddingCategory = false;
  
  // Form data
  selectedValue: number | undefined = undefined;
  sizesInput: string = '';
  colorName: string = '';
  colorCode: string = '#000000';
  newProduct: ProductDto = this.getEmptyProduct();
  productImages: Array<{ file: File; preview: string }> = [];
  isAddingProduct: boolean = false;
  statusProduct = StatusProduct;
  // Categories
  categories: CategoryFullDto[] = [];
  selectedCategory: CategoryFullDto | null = null;
  newCategory: CategoryDto = this.getEmptyCategory();
  
  constructor(
    private categoryService: CategoryService, 
    private productService: ProductService,
    private productRefreshService: ProductRefreshService,
    private cdr: ChangeDetectorRef
  ) {}    

  ngOnInit(): void {
    this.loadCategories();
  }

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

parseSizes(input: string): SizeDto[] {
  return input
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(sizeName => ({ sizeName }));
}
/*parseColors(): ColorDto[] {
  if (!this.productColor) return [];
  return [{
    colorName: 'Custom Color',
    colorCode: this.productColor 
  }];
}*/

  addColor(): void {
    if (this.colorName && this.colorCode) {
      this.newProduct.colors.push({
        colorName: this.colorName.trim(),
        colorCode: this.colorCode
      });
      this.colorName = '';
      this.colorCode = '#000000';
    }
  }

  removeColor(index: number): void {
    this.newProduct.colors.splice(index, 1);
  }

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
    this.productImages.splice(index, 1);
  }

  parseImages(): ImageDto[] {
    return this.productImages.map(file => ({
      imageUrl: file.preview || '',
      imageData: file.preview || ''
    }));
  }
// Product Methods
  addProduct(): void {
    if (this.isAddingProduct) {
      return;
    }
    this.newProduct.images = this.parseImages();
    this.newProduct.categorieId = this.selectedValue!;
    this.isAddingProduct = true;
    
    this.productService.create(this.newProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Produit ajouté avec succès!');
          this.productRefreshService.triggerRefresh();
          this.closeDrawer();
          this.resetProductForm();
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Erreur lors de l\'ajout du produit');
        },
        complete: () => {
          this.isAddingProduct = false;
          this.cdr.detectChanges();
        }
      });
  }
  isFormValid(): boolean {
    return !!(
      this.newProduct.nom &&
      this.newProduct.prix > 0 &&
      this.newProduct.stock >= 0 &&
      this.newProduct.sizes.length > 0 &&
      this.newProduct.colors.length > 0 &&
      this.productImages.length > 0 &&
      this.selectedValue
    );
  }

  resetProductForm(): void {
    this.newProduct = this.getEmptyProduct();
    this.sizesInput = '';
    this.colorName = '';
    this.colorCode = '#000000';
    this.productImages = [];
    this.selectedValue = undefined;
  }

  

  // Category Methods
  loadCategories(): void {
    this.categoryService.getAllCategoriesFull()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categories = data;
          console.log('Categories loaded:', this.categories);
        },
        error: (err) => console.error('Error loading categories:', err)
      });
  }

  saveCategory(event?: Event): void {
    if (event) event.preventDefault();
    if (this.isAddingCategory || !this.newCategory.nom) {
      return;
    }

    this.isAddingCategory = true;
    const request = this.selectedCategory
      ? this.categoryService.update(this.selectedCategory.id, this.newCategory)
      : this.categoryService.create(this.newCategory);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadCategories();
        this.closeCategoryDrawer();
      },
      error: (err) => {
        console.error('Error saving category:', err);
        alert('Erreur lors de la sauvegarde');
      },
      complete: () => {
        setTimeout(() => {
          this.isAddingCategory = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  editSelectedCategory(): void {
    if (!this.selectedValue) return;
    
    const category = this.categories.find(cat => cat.id === this.selectedValue);
    if (category) {
      this.selectedCategory = category;
      this.newCategory = { 
        id: category.id,
        nom: category.nom, 
        description: category.description || '', 
        isActive: category.isActive 
      };
      this.categoryDrawerVisible = true;
    }
  }

  // Drawer Methods
  openDrawer(): void {
    this.visible = true;
  }

  closeDrawer(): void {
    this.visible = false;
    this.resetProductForm();
  }

  openCategoryDrawer(): void {
    this.categoryDrawerVisible = true;
    this.selectedCategory = null;
    this.newCategory = this.getEmptyCategory();
  }

  closeCategoryDrawer(): void {
    this.categoryDrawerVisible = false;
    this.selectedCategory = null;
    this.newCategory = this.getEmptyCategory();
  }

  // Utility Methods
  getDrawerWidth(): number | string {
    if (typeof window === 'undefined') return 600;
    if (window.innerWidth < 576) return '100vw';
    if (window.innerWidth < 768) return '90vw';
    if (window.innerWidth < 992) return '70vw';
    return 600;
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

    addSize(): void {
      if (this.sizesInput && this.sizesInput.trim() !== '') {
        const sizes = this.parseSizes(this.sizesInput);
        this.newProduct.sizes = [...this.newProduct.sizes, ...sizes];
        this.sizesInput = '';
      }
    }

    removeSize(index: number): void {
      this.newProduct.sizes.splice(index, 1);
    }

  private getEmptyCategory(): CategoryDto {
    return { 
      nom: '', 
      description: '', 
      isActive: true 
    };
  }

  onCategoryChange(categoryId: any): void {
    console.log("categoryId reçu:", categoryId, "type:", typeof categoryId);
    if (!categoryId) {
      this.selectedValue = undefined;
      return;
    }

    const numericId = Number(categoryId);

    if (isNaN(numericId)) {
      this.selectedValue = undefined;
      return;
    }

    this.selectedValue = numericId;
    console.log("→ ID sélectionné:", this.selectedValue);
  }
}
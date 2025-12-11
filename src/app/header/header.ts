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
  isAddingProduct = false;
  isAddingCategory = false;
  
  // Form data
  selectedValue: number | undefined = undefined;
  productImages: Array<File & { preview?: string }> = [];
  productColor: string = '#000000';
  sizesInput: string = '';
  
  newProduct: ProductDto = this.getEmptyProduct();
  
  // Categories
  categories: CategoryFullDto[] = [];
  selectedCategory: CategoryFullDto | null = null;
  newCategory: CategoryDto = this.getEmptyCategory();
  
  constructor(
    private categoryService: CategoryService, 
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}    

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Product Methods
  addProduct(): void {
    if (this.isAddingProduct) {
      return;
    }
    
    this.newProduct.sizes = this.parseSizes(this.sizesInput);
    this.newProduct.categorieId = this.selectedValue!;
    this.isAddingProduct = true;
    
    this.productService.create(this.newProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Produit ajouté avec succès!');
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

  validateProduct(): boolean {
    if (!this.newProduct.nom || !this.newProduct.prix || !this.selectedValue || !this.newProduct.stock) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return false;
    }
    return true;
  }

  resetProductForm(): void {
    this.newProduct = this.getEmptyProduct();
    this.sizesInput = '';
    this.productImages = [];
    this.selectedValue = undefined;
    this.productColor = '#000000';
  }

  parseSizes(input: string): string[] {
    return input
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.productImages = Array.from(input.files).map(file => {
        const fileWithPreview = file as File & { preview?: string };
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          fileWithPreview.preview = e.target?.result as string;
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
        return fileWithPreview;
      });
    }
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
      stock: 0,
      status: StatusProduct.ACTIF,
      categorieId: 0
    };
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
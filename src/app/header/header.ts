import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule, NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CategoryFullDto } from '../dto/CategoryFullDto';
import { CategoryService } from '../services/category/category.service';
import { CategoryDto } from '../dto/CategoryDto';
import { ProductDto } from '../dto/ProductDto';
import { StatusProduct } from '../enum/StatusProduct';
import { ProductService } from '../services/product/product.service';
  function alphabet(): string[] {
  const children: string[] = [];
  for (let i = 10; i < 36; i++) {
    children.push(i.toString(36) + i);
  }
  return children;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, NzDrawerModule, NzButtonModule, NzFormModule, NzInputModule, NzSelectModule, NzDatePickerModule, NgFor],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header implements OnInit {
  
readonly listOfOption: string[] = alphabet();
  size: NzSelectSizeType = 'default';
  singleValue = 'a10';
  multipleValue = ['a10', 'c12'];
  tagValue = ['a10', 'c12', 'tag'];



  visible = false;
  selectedValue: number | undefined = undefined;
  value: string = '';
  productImages: any[] = [];
  productColor: string = '#000000';
  categories: CategoryFullDto[] = [];
  selectedCategory: any = null;
  categoryDrawerVisible = false;
  newCategory: CategoryDto = { nom: '', description: '', isActive: true  };
  isAddingCategory = false;
  isAddingProduct = false;

  newProduct: ProductDto = {
    nom: '',
    description: '',
    prix: 0,
    sizes: [],
    stock: 0,
    status: StatusProduct.ACTIF,
    categorieId: 0
  };
  sizesInput: string = '';
  
  constructor(
    private categoryService: CategoryService, 
    private productService: ProductService,
    private cdr: ChangeDetectorRef) {}    


  ngOnInit(): void {
    this.categoryService.getAllCategoriesFull().subscribe(data => {
    this.categories = data;
    console.log('Fetched categories:', this.categories);
  });
  }

  onCategorySelect(value: number): void {
    console.log('Category selected:', value);
    this.selectedValue = value;
  }

  addProduct(): void {
    if (this.isAddingProduct) return;
    
    // Parse sizes from comma-separated input
    this.newProduct.sizes = this.sizesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    this.newProduct.categorieId = this.selectedValue || 0;
    
    this.isAddingProduct = true;
    this.cdr.detectChanges();
    
    // Call ProductService to create product
    this.productService.create(this.newProduct).subscribe({
      next: (result) => {
        console.log('Product created successfully:', result);
        this.isAddingProduct = false;
        this.closeDrawer();
        this.resetProductForm();
        this.cdr.detectChanges();
        // Optionally show success message
        alert('Produit ajouté avec succès!');
      },
      error: (err: any) => {
        console.error('Error adding product:', err);
        this.isAddingProduct = false;
        this.cdr.detectChanges();
        alert('Erreur lors de l\'ajout du produit');
      }
    });
  }

  resetProductForm(): void {
    this.newProduct = {
      nom: '',
      description: '',
      prix: 0,
      sizes: [],
      stock: 0,
      status: StatusProduct.ACTIF,
      categorieId: 0
    };
    this.sizesInput = '';
    this.productImages = [];
    this.selectedValue = undefined;
  }

  openDrawer(): void {
    console.log('Opening drawer, visible before:', this.visible);
    this.visible = true;
    console.log('Opening drawer, visible after:', this.visible);
     setTimeout(() => {
      this.visible = true;
    }, 0);
  }


  closeDrawer(): void {
    this.visible = false;
    this.cdr.detectChanges();
  }

  

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.productImages = Array.from(input.files).map(file => {
        const fileWithPreview: any = file;
        const reader = new FileReader();
        reader.onload = (e: any) => fileWithPreview.preview = e.target.result;
        reader.readAsDataURL(file);
        return fileWithPreview;
      });
    }
  }

  openCategoryDrawer(): void {
      this.categoryDrawerVisible = true;
      this.selectedCategory = null; 
      this.newCategory = { nom: '', description: '', isActive: true };
  }
  
  onEditCategory(cat: CategoryFullDto): void {
    this.selectedCategory = cat;
    this.newCategory = { 
      id: cat.id,
      nom: cat.nom, 
      description: cat.description || '', 
      isActive: cat.isActive 
    };
    this.categoryDrawerVisible = true;
  }

  closeCategoryDrawer() {
    this.categoryDrawerVisible = false;
    this.selectedCategory = null;
  }

  addCategory(): void {
  if (this.isAddingCategory) return;
  this.isAddingCategory = true;
  this.cdr.detectChanges();
  
  this.categoryService.create(this.newCategory).subscribe({
    next: (result) => {
      this.isAddingCategory = false;
      this.categoryDrawerVisible = false;
      this.newCategory = { nom: '', description: '', isActive: true };
      this.cdr.detectChanges();
      this.categoryService.getAllCategoriesFull().subscribe(data => {
        this.categories = data;
        this.cdr.detectChanges();
      });
    },
    error: (err) => {
      console.error('Error adding category:', err);
      this.isAddingCategory = false;
      this.cdr.detectChanges();
    }
  });
}
  getActiveCategory() {
  this.categoryService.getByIsActive(true).subscribe({
    next: (category) => {
      this.selectedCategory = category;
      console.log('Active Category:', this.selectedCategory);
    },
    error: (err) => {
      // Handle error
    }
  });
}

updateCategory(): void {
  if (this.isAddingCategory || !this.newCategory.id) return;
  this.isAddingCategory = true;
  this.cdr.detectChanges();

  this.categoryService.update(this.newCategory.id, this.newCategory).subscribe({
    next: () => {
      this.isAddingCategory = false;
      this.categoryDrawerVisible = false;
      this.selectedCategory = null;
      this.newCategory = { nom: '', description: '', isActive: true };
      this.cdr.detectChanges();

      this.categoryService.getAllCategoriesFull().subscribe(data => {
        this.categories = data;
        this.cdr.detectChanges();
      });
    },
    error: (err) => {
      console.error('Error updating category:', err);
      this.isAddingCategory = false;
      this.cdr.detectChanges();
    }
  });
}

saveCategory(): void {
  if (this.selectedCategory) {
    this.updateCategory();
  } else {
    this.addCategory();
  }
}

editSelectedCategory(): void {
  console.log('selectedValue:', this.selectedValue);
  console.log('selectedValue type:', typeof this.selectedValue);
  console.log('categories:', this.categories);
  
  if (this.selectedValue === null || this.selectedValue === undefined) {
    console.log('No category selected');
    return;
  }
  
  console.log('Looking for category with id:', this.selectedValue);
  const categoryToEdit = this.categories.find(cat => {
    console.log('Comparing cat.id:', cat.id, 'typeof:', typeof cat.id, 'with selectedValue:', this.selectedValue, 'typeof:', typeof this.selectedValue);
    return cat.id === this.selectedValue;
  });
  console.log('Found category:', categoryToEdit);
  
  if (categoryToEdit) {
    this.onEditCategory(categoryToEdit);
  } else {
    console.log('Category not found in list');
  }
}

getDrawerWidth(): number | string {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 576) return '100vw';
    if (window.innerWidth < 768) return '90vw';
    if (window.innerWidth < 992) return '70vw';
  }
  return 600;
}


onCategoryChange(value: any): void {
  this.selectedValue = value ? Number(value) : undefined;
}

}

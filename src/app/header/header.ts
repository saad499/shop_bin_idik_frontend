import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CategoryFullDto } from '../dto/CategoryFullDto';
import { CategoryService } from '../services/category/category.service';
import { CategoryDto } from '../dto/CategoryDto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, NzDrawerModule, NzButtonModule, NzFormModule, NzInputModule, NzSelectModule, NzDatePickerModule, NgFor],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  
  visible = false;
  selectedValue: string | null = null;
  value: string = '';
  productImages: any[] = [];
  productColor: string = '#000000';
  categories: CategoryFullDto[] = [];
  selectedCategory: any = null;
  categoryDrawerVisible = false;
  newCategory: CategoryDto = { name: '', description: '', isActive: true  };
  
  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) {}    


  ngOnInit(): void {
    this.categoryService.getAllCategoriesFull().subscribe(data => {
    this.categories = data;
  });
  }



  openDrawer(): void {
    console.log('Opening drawer, visible before:', this.visible);
    this.visible = true;
    console.log('Opening drawer, visible after:', this.visible);
    this.cdr.detectChanges();
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

  openCategoryDrawer() {
    this.categoryDrawerVisible = true;
    this.newCategory = { name: '', description: '' };
}
  onEditCategory(cat: any) {
    this.selectedCategory = cat;
    this.categoryDrawerVisible = true;
  }

  closeCategoryDrawer() {
    this.categoryDrawerVisible = false;
  }

  addCategory() {
    this.categoryService.create(this.newCategory).subscribe({
    next: (result) => {
      // Optionally refresh categories or show a success message
      this.closeCategoryDrawer();
      this.newCategory = { name: '', description: '', isActive: true };
      this.cdr.detectChanges();
    },
    error: (err) => {
      // Handle error (show message, etc.)
    }
  });
  }

  getActiveCategory() {
  this.categoryService.getByIsActive(true).subscribe({
    next: (category) => {
      // Use the returned category
      this.selectedCategory = category;
      console.log('Active Category:', this.selectedCategory);
    },
    error: (err) => {
      // Handle error
    }
  });
}

updateCategory() {
  if (typeof this.newCategory.id === 'number') {
    this.categoryService.update(this.newCategory.id, this.newCategory).subscribe({
      next: () => {
        // Success: refresh list, close drawer, show message, etc.
        this.closeCategoryDrawer();
      },
      error: (err) => {
        // Handle error
      }
    });
  } else {
    // Handle error: id is missing or invalid
    // Optionally show a message to the user
  }
}

getDrawerWidth(): number | string {
  // SSR-safe: check if window exists
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 576) return '100vw';
    if (window.innerWidth < 768) return '90vw';
    if (window.innerWidth < 992) return '70vw';
  }
  return 600; // Default for SSR or unknown environment
}


}

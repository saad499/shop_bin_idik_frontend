import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, NzDrawerModule, NzButtonModule, NzFormModule, NzInputModule, NzSelectModule, NzDatePickerModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  visible = false;
  selectedValue: string | null = null;
  value: string = '';
  productImages: any[] = [];
  productColor: string = '#000000';

  openDrawer() {
    this.visible = true;
  }

  closeDrawer() {
    this.visible = false;
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
}

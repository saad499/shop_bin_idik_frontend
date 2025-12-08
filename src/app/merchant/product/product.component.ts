import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchant-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDividerModule, NzTableModule, NzSwitchModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class MerchantProductComponent {}

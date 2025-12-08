import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { PlusOutline } from '@ant-design/icons-angular/icons';

@NgModule({
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule   
  ],
  exports: [
    CommonModule,
    NzButtonModule,
    NzIconModule
  ],
  providers: [
    { provide: NZ_ICONS, useValue: [PlusOutline] }
  ]
})
export class SharedModule {}

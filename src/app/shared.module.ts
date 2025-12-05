import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
  ]
})
export class SharedModule {}

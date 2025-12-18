import { Routes } from '@angular/router';
import { MerchantComponent } from './merchant/merchant.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { CustomerComponent } from './customer/customer.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { merchantRoutes } from './merchant/merchant.root';
import { customerRoutes } from './customer/customer.root';

export const routes: Routes = [
  { path: '', redirectTo: 'merchant', pathMatch: 'full' },
  {
    path: 'merchant',
    component: MerchantComponent,
    children: merchantRoutes
  },
  { path: 'administrator', component: AdministratorComponent },
  {
    path: 'customer',
    component: CustomerComponent,
    children: customerRoutes
  },
  { path: 'delivery', component: DeliveryComponent },
];

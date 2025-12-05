import { Routes } from '@angular/router';
import { MerchantCategoryComponent } from './category/category.component';
import { MerchantDashboardComponent } from './dashboard/dashboard.component';
import { MerchantDeliveryComponent } from './delivery/delivery.component';
import { MerchantInventoryComponent } from './inventory/inventory.component';
import { MerchantOrderComponent } from './order/order.component';
import { MerchantProductComponent } from './product/product.component';
import { MerchantProfileComponent } from './profile/profile.component';
import { MerchantReviewComponent } from './review/review.component';
import { MerchantSettingsComponent } from './settings/settings.component';

export const merchantRoutes: Routes = [
  { path: 'category', component: MerchantCategoryComponent },
  { path: 'dashboard', component: MerchantDashboardComponent },
  { path: 'delivery', component: MerchantDeliveryComponent },
  { path: 'inventory', component: MerchantInventoryComponent },
  { path: 'order', component: MerchantOrderComponent },
  { path: 'product', component: MerchantProductComponent },
  { path: 'profile', component: MerchantProfileComponent },
  { path: 'review', component: MerchantReviewComponent },
  { path: 'settings', component: MerchantSettingsComponent },
];

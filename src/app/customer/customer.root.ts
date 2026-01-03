import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MagazinComponent } from './magazin/magazin.component';
import { ProductComponent } from './product/product.component';
import { FollowCommandComponent } from './follow-command/follow-command.component';
import { FollowOrderComponent } from './follow-order/follow-order.component';

export const customerRoutes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'magasin', component: MagazinComponent },
  { path: 'product', component: ProductComponent },
  { path: 'follow-order', component: FollowOrderComponent },
];

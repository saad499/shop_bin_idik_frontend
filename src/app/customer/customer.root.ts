import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MagasinComponent } from './magasin/magasin.component';
import { ProductComponent } from './product/product.component';
import { FollowCommandComponent } from './follow-command/follow-command.component';

export const customerRoutes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'magasin', component: MagasinComponent },
  { path: 'product', component: ProductComponent },
  { path: 'follow-command', component: FollowCommandComponent },
];

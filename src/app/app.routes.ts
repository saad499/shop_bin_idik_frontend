import { Routes } from '@angular/router';
import { MerchantComponent } from './merchant/merchant.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { CustomerComponent } from './customer/customer.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { merchantRoutes } from './merchant/merchant.root';
import { customerRoutes } from './customer/customer.root';
import { FeedbackComponent } from './feedback/feedback.component';
import { ContactSupportComponent } from './contact-support/contact-support.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { PrincipalComponent } from './principal/principal.component';
import { LoginComponent } from './login/login.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { InscriptionCommercantComponent } from './inscription-commercant/inscription-commercant.component';
import { InscriptionDeliveryComponent } from './inscription-delivery/inscription-delivery.component';

export const routes: Routes = [
  { path: '', redirectTo: 'principal', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent },
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
  { path: 'feedback', component: FeedbackComponent },
  { path: 'contact-support', component: ContactSupportComponent },
  { path: 'help-support', component: HelpSupportComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'inscription-commercant', component: InscriptionCommercantComponent },
  { path: 'inscription-delivery', component: InscriptionDeliveryComponent },
];

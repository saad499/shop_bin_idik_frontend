import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/customer/landing-page', pathMatch: 'full' as const },
  { path: 'customer/follow-order', loadComponent: () => import('./app/customer/follow-order/follow-order.component').then(m => m.FollowOrderComponent) },
  { path: 'customer/feedback', loadComponent: () => import('./app/customer/feedback/feedback.component').then(m => m.FeedbackComponent) },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

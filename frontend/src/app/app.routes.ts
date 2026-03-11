import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'marketplace',
    loadChildren: () => import('./features/marketplace/marketplace.routes').then(m => m.MARKETPLACE_ROUTES)
  },
  {
    path: 'farmer-dashboard',
    loadChildren: () => import('./features/farmer-dashboard/farmer-dashboard.routes').then(m => m.FARMER_ROUTES),
    canActivate: [AuthGuard],
    data: { role: 'FARMER' }
  },
  {
    path: 'buyer-dashboard',
    loadChildren: () => import('./features/buyer-dashboard/buyer-dashboard.routes').then(m => m.BUYER_ROUTES),
    canActivate: [AuthGuard],
    data: { role: 'BUYER' }
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then(m => m.ORDER_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadComponent: () => import('./features/messages/messages.component').then(m => m.MessagesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./features/orders/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent),
    canActivate: [AuthGuard],
    data: { role: 'BUYER' }
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    redirectTo: 'cart'
  },
  {
    path: 'jobs',
    loadChildren: () => import('./features/jobs/jobs.routes').then(m => m.jobRoutes)
  },
  {
    path: 'payment-settings',
    loadComponent: () => import('./features/payment/payment-settings.component').then(m => m.PaymentSettingsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'logistics',
    loadComponent: () => import('./features/logistics/logistics.component').then(m => m.LogisticsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/marketplace'
  }
];

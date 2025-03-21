import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/security/auth-guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/features/auth-shell/auth-rounting'),
        canActivateChild: [publicGuard()]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [privateGuard()]
    },
    {
        path: 'product',
        loadComponent: () => import('./shared/ui/layout.component'),
        loadChildren: () => import('./pages/products/product.routes'),
        canActivate: [privateGuard()]
    },
    {
        path: '**',
        redirectTo: 'product'
    }
];

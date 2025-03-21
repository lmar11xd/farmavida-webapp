import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/security/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component')
            },
            {
                path: 'product',
                loadChildren: () => import('./pages/products/product.routes'),
                canActivate: [privateGuard()]
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile.component'),
                canActivate: [privateGuard()]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/features/auth-shell/auth-rounting'),
        canActivateChild: [publicGuard()]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];

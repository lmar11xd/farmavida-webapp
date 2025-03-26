import { Routes } from '@angular/router';
import { adminGuard, privateGuard, publicGuard, vendedorGuard } from './core/security/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component'),
                canActivate: [privateGuard],
                data: { breadcrumb: 'Dashboard' }
            },
            {
                path: 'product',
                loadChildren: () => import('./pages/products/product.routes'),
                canActivate: [adminGuard],
                data: { breadcrumb: 'Producto' }
            },
            {
                path: 'user',
                loadChildren: () => import('./pages/users/users.routes'),
                canActivate: [adminGuard],
                data: { breadcrumb: 'Usuario' }
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile.component'),
                canActivate: [privateGuard],
                data: { breadcrumb: 'Profile' }
            },
            {
                path: 'product-catalog',
                loadComponent: () => import('./pages/product-catalog/product-catalog.component'),
                canActivate: [vendedorGuard],
                data: { breadcrumb: 'Catálogo de Productos' }
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
        canActivateChild: [publicGuard]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];

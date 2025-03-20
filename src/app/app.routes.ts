import { Routes } from '@angular/router';
import { AuthGuard } from './core/security/auth-guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/features/auth-shell/auth-rounting')
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];

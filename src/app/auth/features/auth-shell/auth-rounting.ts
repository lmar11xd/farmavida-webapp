import { Routes } from '@angular/router';

export default [
    {
        path: 'signup',
        loadComponent: () => import('../signup/signup.component')
    },
    {
        path: 'login',
        loadComponent: () => import('../login/login.component')
    },
    {
        path: '**',
        redirectTo: 'login' 
    }
] as Routes;
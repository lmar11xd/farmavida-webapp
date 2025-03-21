import { Routes } from "@angular/router";

export default [
    {
        path: 'list',
        loadComponent: () => import('./product-list/product-list.component')
    },
    {
        path: 'create',
        loadComponent: () => import('./product-create/product-create.component')
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./product-edit/product-edit.component')
    },
    {
        path: '**',
        redirectTo: 'list'
    }
] as Routes
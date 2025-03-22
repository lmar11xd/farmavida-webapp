import { Routes } from "@angular/router";

export default [
    {
        path: 'list',
        loadComponent: () => import('./product-list/product-list.component'),
        data: { breadcrumb: 'Listar' }
    },
    {
        path: 'create',
        loadComponent: () => import('./product-create/product-create.component'),
        data: { breadcrumb: 'Crear' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./product-edit/product-edit.component'),
        data: { breadcrumb: 'Editar' }
    },
    {
        path: '**',
        redirectTo: 'list'
    }
] as Routes
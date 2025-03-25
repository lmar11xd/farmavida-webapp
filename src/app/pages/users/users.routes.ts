import { Routes } from "@angular/router";

export default [
    {
        path: 'list',
        loadComponent: () => import('./user-list/user-list.component'),
        data: { breadcrumb: 'Listar' }
    },
    {
        path: 'create',
        loadComponent: () => import('./user-create/user-create.component'),
        data: { breadcrumb: 'Crear' }
    },
    {
        path: 'edit',
        loadComponent: () => import('./user-edit/user-edit.component'),
        data: { breadcrumb: 'Editar' }
    },
    {
        path: '**',
        redirectTo: 'list'
    }
] as Routes
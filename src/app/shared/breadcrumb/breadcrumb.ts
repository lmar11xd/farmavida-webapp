import { MenuItem } from "primeng/api";

export let BREADCRUMB: { [key: string]: MenuItem[] } = {};

export const LISTAR_PRODUCTO: MenuItem[] = [
  {label:'Productos', url: '/product/list', target: ''}
];

export const CREAR_PRODUCTO: MenuItem[] = [
  {label:'Crear', url: '/product/create', target: ''}
];

export const EDITAR_PRODUCTO: MenuItem[] = [
  {label:'Editar', url: '/product/edit/:id', target: ''}
];

BREADCRUMB['/product/list'] = LISTAR_PRODUCTO;
BREADCRUMB['/product/create'] = CREAR_PRODUCTO;
BREADCRUMB['/product/edit'] = EDITAR_PRODUCTO;
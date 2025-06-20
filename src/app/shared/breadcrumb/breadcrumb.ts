import { MenuItem } from "primeng/api";

export let BREADCRUMB: { [key: string]: MenuItem[] } = {};

export const LISTAR_PRODUCTO: MenuItem[] = [
  {label:'Productos', url: '/product/list', target: ''}
];

export const CREAR_PRODUCTO: MenuItem[] = [
  {label:'Crear', url: '/product/create', target: ''}
];

export const EDITAR_PRODUCTO: MenuItem[] = [
  {label:'Editar', url: '/product/edit?pkey=:id', target: ''}
];

export const LISTAR_USUARIO: MenuItem[] = [
  {label:'Usuarios', url: '/user/list', target: ''}
];

export const CREAR_USUARIO: MenuItem[] = [
  {label:'Crear', url: '/user/create', target: ''}
];

export const EDITAR_USUARIO: MenuItem[] = [
  {label:'Editar', url: '/user/edit?pkey=:id', target: ''}
];

export const LISTAR_CATALOGO: MenuItem[] = [
  {label:'Catálogo de Productos', url: '/product-catalog/list', target: ''}
];

export const LISTAR_INGRESO_PRODUCTO: MenuItem[] = [
  {label:'Ingreso Productos', url: '/product-entry/list', target: ''}
];

export const LISTAR_VENTAS: MenuItem[] = [
  {label:'Ventas', url: '/sale/list', target: ''}
];

export const LISTAR_CAJAS: MenuItem[] = [
  {label:'Cajas', url: '/sales-box/list', target: ''}
];

BREADCRUMB['/product/list'] = LISTAR_PRODUCTO;
BREADCRUMB['/product/create'] = CREAR_PRODUCTO;
BREADCRUMB['/product/edit'] = EDITAR_PRODUCTO;
BREADCRUMB['/user/list'] = LISTAR_USUARIO;
BREADCRUMB['/user/create'] = CREAR_USUARIO;
BREADCRUMB['/user/edit'] = EDITAR_USUARIO;
BREADCRUMB['/product-catalog/list'] = LISTAR_CATALOGO;
BREADCRUMB['/product-entry/list'] = LISTAR_INGRESO_PRODUCTO;
BREADCRUMB['/sale/list'] = LISTAR_VENTAS;
BREADCRUMB['/sales-box/list'] = LISTAR_CAJAS;

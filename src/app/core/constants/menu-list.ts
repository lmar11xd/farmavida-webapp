import { UserRolEnum } from "../enums/user-rol.enum";

export const menuList = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'pi pi-home',
    role: null
  },
  {
    title: 'Productos',
    url: '/product',
    icon: 'pi pi-book',
    role: UserRolEnum.ADMINISTRADOR
  },
  {
    title: 'Ingreso Productos',
    url: '/product-entry',
    icon: 'pi pi-list-check',
    role: UserRolEnum.ADMINISTRADOR
  },
  {
    title: 'Catálogo',
    url: '/product-catalog',
    icon: 'pi pi-list',
    role: UserRolEnum.VENDEDOR
  },
  {
    title: 'Caja',
    url: '/sale-box',
    icon: 'pi pi-box',
    role: UserRolEnum.VENDEDOR
  },
  {
    title: 'Ventas',
    url: '/sale',
    icon: 'pi pi-dollar',
    role: null
  },
  {
    title: 'Usuarios',
    url: '/user',
    icon: 'pi pi-users',
    role: UserRolEnum.ADMINISTRADOR
  },
]

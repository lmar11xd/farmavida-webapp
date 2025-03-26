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
        title: 'Usuarios',
        url: '/user',
        icon: 'pi pi-users',
        role: UserRolEnum.ADMINISTRADOR
    },
    {
        title: 'Catálogo',
        url: '/product-catalog',
        icon: 'pi pi-list',
        role: UserRolEnum.VENDEDOR
    }
]
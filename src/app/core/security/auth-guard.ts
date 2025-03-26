import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { LOCAL_ROLE_ADMIN, LOCAL_ROLE_VENDEDOR, LOCAL_USER } from "../constants/constants";

export const privateGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verificar si estamos en el navegador
  if (typeof window !== 'undefined' && localStorage.getItem(LOCAL_USER)) {
    return true
  }

  router.navigateByUrl('/auth/login');
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verificar si estamos en el navegador
  if (typeof window !== 'undefined' && localStorage.getItem(LOCAL_USER) && localStorage.getItem(LOCAL_ROLE_ADMIN)) {
    return true
  }

  router.navigateByUrl('/auth/login');
  return false;
};

export const vendedorGuard: CanActivateFn = () => {
  const router = inject(Router);
  // Verificar si estamos en el navegador
  if (typeof window !== 'undefined' && localStorage.getItem(LOCAL_USER) && localStorage.getItem(LOCAL_ROLE_VENDEDOR)) {
    return true
  }

  router.navigateByUrl('/auth/login');
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verificar si estamos en el navegador
  if (typeof window !== 'undefined' && localStorage.getItem(LOCAL_USER)) {
    router.navigateByUrl('/dashboard')
    return false;
  } else {
    return true;
  }
};


/*
export const privateGuard = (): CanActivateFn => {
  return () => { 
    const router = inject(Router)
    const authState = inject(AuthStateService)

    return authState.authState$.pipe(
      map(state => {
        if(!state) {
          router.navigateByUrl('/auth/login')
          return false
        }
        return true
      })
    )
  }
}*/

/*
export const publicGuard = (): CanActivateFn => {
    return () => {
      const router = inject(Router)
      const authState = inject(AuthStateService)
      return authState.authState$.pipe(
        map(state => {
          if(state) {
            router.navigateByUrl('/dashboard')
            return false
          }
          return true
        })
    )
  }
}*/
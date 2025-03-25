import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs";
import { inject } from "@angular/core";
import { AuthStateService } from "../../shared/services/auth.state.service";
import { LOCAL_USER } from "../constants/constants";

export const privateGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verificar si estamos en el navegador
  if (typeof window !== 'undefined' && localStorage.getItem(LOCAL_USER)) {
    return true;
  } else {
    router.navigateByUrl('/auth/login');
    return false;
  }
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
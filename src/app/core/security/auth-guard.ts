import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { LOCAL_ROLE_ADMIN, LOCAL_ROLE_VENDEDOR, LOCAL_USER, POINT_SALE_ID } from "../constants/constants";

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

export const puntoVentaGuard: CanActivateFn = async (route, state) => {
  const firestore = inject(Firestore);
  const router = inject(Router);

  // Obtener identificador único del dispositivo
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const deviceId = result.visitorId; // ID único del navegador

  console.log('ID del dispositivo:', deviceId);

  // Guardar el ID en localStorage
  localStorage.setItem(POINT_SALE_ID, deviceId);

  // Buscar en Firestore si el dispositivo está registrado
  const docRef = doc(firestore, 'points-sale', deviceId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log('El dispositivo está registrado:', docSnap.data());
    return true; // Permitir acceso
  } else {
    console.log('El dispositivo no está registrado');
    router.navigate(['/dashboard']);
    return false;
  }
}


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

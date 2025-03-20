import { inject } from "@angular/core";
import {  Router } from "@angular/router";
import { SessionLocalService } from "./session-local.service";

export const AuthGuard = () => {
    const authService = inject(SessionLocalService);
    const router = inject(Router);
  
    if (!authService.isAuthenticated()) {
      if (router.url !== '/auth/login') {  // Evita redirecciones innecesarias
        setTimeout(() => router.navigate(['/auth/login']), 0);
      }
      return false;
    }
    
    return true;
  };
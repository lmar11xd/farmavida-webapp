import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs";
import { inject } from "@angular/core";
import { AuthStateService } from "../../shared/data-access/auth.state.service";

export const privateGuard = (): CanActivateFn => {
  return () => { 
    const router = inject(Router)
    const authState = inject(AuthStateService)

    return authState.authState$.pipe(
      map(state => {
        console.log(state)
        if(!state) {
          router.navigateByUrl('/auth/login')
          return false
        }
        return true
      })
    )
  }
}

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
}
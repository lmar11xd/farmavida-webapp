import { Component } from "@angular/core";
import { Router, RouterOutlet } from '@angular/router';
import { AuthStateService } from "../data-access/auth.state.service";

@Component({
    standalone: true,
    imports: [RouterOutlet],
    selector: 'app-layout',
    template: `
    <button (click)="logout()">Cerrar Sesión</button>
    <router-outlet />
    `
})
export default class LayoutComponent {
    constructor(private _authState: AuthStateService, private _router: Router) {}

    async logout() {
      await this._authState.logout()
      this._router.navigateByUrl('/auth/login')
    }
}
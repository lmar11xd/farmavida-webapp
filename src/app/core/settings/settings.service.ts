import { Injectable } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import { LOCAL_USER } from "../constants/constants";
import { AuthService, User } from "../security/auth-service";
import { UserRolEnum } from "../enums/user-rol.enum";

@Injectable({
    providedIn: 'root' // ✅ Esto hace que esté disponible en toda la app
})
export class SettingsService {

    public session: any;
    public urlSessionOn: any;

    constructor(
        private authService: AuthService,
        private spinnerService: NgxSpinnerService
    ) {
        this.session = {}
    }

    getSession() {
        return this.session
    }

    setSession(session: any) {
        this.session = Object.assign({}, session)
    }

    setUrlSessionOn(urlSessionOn: string) {
        this.urlSessionOn = urlSessionOn;
    }

    getUrlSessionOn() {
        return this.urlSessionOn;
    }

    showSpinner() {
        this.spinnerService.show();
    }

    hideSpinner() {
        this.spinnerService.hide();
    }

    getUserInfo(): User | null {
        const data = localStorage.getItem(LOCAL_USER);
        
        if(data != null) {
            const user = JSON.parse(data) as User
            return user;
        }

        return null;
    }

    async logout() {
        const user = this.getUserInfo()
        if(user != null && user.role == UserRolEnum.ADMINISTRADOR) {
            await this.authService.logout()
        } else {
            this.authService.logoutVendedor()
        }
    }

}

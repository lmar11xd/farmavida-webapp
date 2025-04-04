import { Injectable } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import { LOCAL_USER } from "../constants/constants";
import { AuthService } from "../security/auth-service";
import { User } from "../models/user";
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root' // ✅ Esto hace que esté disponible en toda la app
})
export class SettingsService {

  constructor(
      private authService: AuthService,
      private spinnerService: NgxSpinnerService,
      private messageService: MessageService
  ) {
  }

  showSpinner() {
    this.spinnerService.show();
  }

  hideSpinner() {
    this.spinnerService.hide();
  }

  showMessage(severity: 'success' | 'warn' | 'error', summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
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
    await this.authService.logout();
  }

}

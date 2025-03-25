import { Component, input, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../services/auth.state.service';
import { LogoComponent } from "../../logo/logo.component";
import { AuthService } from '../../../core/security/auth-service';
import { SettingsService } from '../../../core/settings/settings.service';
import { User } from '../../../pages/users/users.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink, RouterLinkActive,
    LogoComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  visible = input.required<boolean>()
  userInfo: User | null = null
  
  constructor(private _settings: SettingsService, private _router: Router) {}

  ngOnInit(): void {
    this.userInfo = this._settings.getUserInfo()
  }

  async logout() {
    await this._settings.logout()
    this._router.navigateByUrl('/auth/login')
  }
}

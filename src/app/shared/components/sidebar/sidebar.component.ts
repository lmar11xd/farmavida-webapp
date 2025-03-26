import { Component, input, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from "../../logo/logo.component";
import { SettingsService } from '../../../core/settings/settings.service';
import { User } from '../../../core/security/auth-service';
import { UserRolEnum } from '../../../core/enums/user-rol.enum';

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
  role = UserRolEnum
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

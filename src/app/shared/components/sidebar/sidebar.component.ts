import { Component, input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from "../../logo/logo.component";
import { SettingsService } from '../../../core/settings/settings.service';
import { User } from '../../../core/models/user';
import { UserRolEnum } from '../../../core/enums/user-rol.enum';
import { menuList } from '../../../core/constants/menu-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LogoComponent
],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit {
  visible = input.required<boolean>()
  menuList = menuList
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

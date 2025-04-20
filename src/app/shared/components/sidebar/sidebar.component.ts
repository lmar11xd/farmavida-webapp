import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoComponent } from "../../logo/logo.component";
import { SettingsService } from '../../../core/settings/settings.service';
import { User } from '../../../core/models/user';
import { UserRolEnum } from '../../../core/enums/user-rol.enum';
import { menuList } from '../../../core/constants/menu-list';

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
  @Output() onHidden = new EventEmitter<string>();
  menuList = menuList
  role = UserRolEnum
  userInfo: User | null = null
  deviceId: string

  constructor(private _settings: SettingsService, private _router: Router) {
    this.deviceId = ''
  }

  ngOnInit(): void {
    this.userInfo = this._settings.getUserInfo()

    this._settings.getDeviceId().then((id) => {
      this.deviceId = id
    })

  }

  hidden() {
    this.onHidden.emit('hidden')
  }

  async logout() {
    await this._settings.logout()
    this._router.navigateByUrl('/auth/login')
  }
}

import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { UserTableComponent } from "../../components/user-table/user-table.component";
import { SettingsService } from '../../../core/settings/settings.service';
import { LISTAR_USUARIO } from '../../../shared/breadcrumb/breadcrumb';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { UserService } from '../users.service';
import { User } from '../../../core/models/user';
import { USER_SUPERADMIN } from '../../../core/constants/constants';

@Component({
  selector: 'app-user-list',
  imports: [UserTableComponent, RouterLink, ButtonModule],
  templateUrl: './user-list.component.html',
  styles: ``
})
export default class UserListComponent implements OnInit {
  users: User[] = []

  constructor(
    private _userService: UserService,
    private _settings: SettingsService,
    private _breadcrumService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initialize()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs(LISTAR_USUARIO);
  }

  initialize() {
    this._settings.showSpinner()
    this._userService.getUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
          this.users = this.users.filter(user => user.username !== USER_SUPERADMIN); // Exclude superadmin from the list
          this._settings.hideSpinner();
        },
        error: (error) => {
          console.error('Error al obtener datos', error);
          this._settings.hideSpinner();
        }
      });
  }
}


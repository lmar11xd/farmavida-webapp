import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { SettingsService } from '../../core/settings/settings.service';
import { User } from '../../core/models/user';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent implements OnInit {
  userInfo: User | null = null

  constructor(private _breadcrumService: BreadcrumbService, private _settings: SettingsService) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.userInfo =this._settings.getUserInfo()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs([]);
  }
}

import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit {

  constructor(private _breadcrumService: BreadcrumbService) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs([]);
  }
}

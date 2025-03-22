import { Component } from '@angular/core';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent {
  constructor(private _breadcrumService: BreadcrumbService) {}
  
    ngOnInit(): void {
      this.initializeBreadcrumb()
    }
  
    initializeBreadcrumb() {
      this._breadcrumService.addBreadcrumbs([]);
    }
}

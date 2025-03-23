import { Component } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { filter, Observable } from 'rxjs';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './breadcrumb.component.html',
  styles: ``
})
export class BreadcrumbComponent {
  breadcrumbs$: Observable<MenuItem[]>;
  dashboard: MenuItem = { label: 'Dashboard', url: '/', target: '' };
  breadcrumbs: MenuItem[] = [];

  pageInfo: Data = {} as Data; // Inicialización segura

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;

    // Suscribirse correctamente evitando fugas de memoria
    this.breadcrumbs$.subscribe(val => this.breadcrumbs = val ?? []);
  }
}

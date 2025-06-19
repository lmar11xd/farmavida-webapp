import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SaleService } from './sales.service';
import { SaleTableComponent } from "../components/sale-table/sale-table.component";
import { Sale } from '../../core/models/sale';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { SettingsService } from '../../core/settings/settings.service';
import { LISTAR_VENTAS } from '../../shared/breadcrumb/breadcrumb';
import { UserRolEnum } from '../../core/enums/user-rol.enum';

@Component({
  selector: 'app-sales',
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, DatePickerModule, SaleTableComponent],
  templateUrl: './sales.component.html',
  styles: ``
})
export default class SalesComponent implements OnInit {
  sales: Sale[] = [];

  startDate = new Date();
  endDate = new Date();

  constructor(
    private _breadcrumService: BreadcrumbService,
    private _saleService: SaleService,
    private _settings: SettingsService,
  ) {}

  ngOnInit(): void {
    this.initializeBreadcrumb();
    this.initialize();
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs(LISTAR_VENTAS);
  }

  initialize() {
    this.loadSales();
  }

  loadSales() {
    this._settings.showSpinner();
    const user = this._settings.getUserInfo();
    let username = user?.username || '';
    if (user?.role === UserRolEnum.ADMINISTRADOR) {
      username = 'ALL';
    }

    this._saleService
      .getSales(username, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.sales = data;
          this._settings.hideSpinner();
        },
        error: (error) => {
          console.error('Error', error);
          this._settings.hideSpinner();
        },
      });
  }
}

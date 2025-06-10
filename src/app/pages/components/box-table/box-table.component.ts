import { Component, input, ViewChild } from '@angular/core';
import { Box } from '../../../core/models/box';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Timestamp } from '@firebase/firestore';
import { convertDatetimeToString } from '../../../core/core-util';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { SaleService } from '../../sales/sales.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { SaleBoxReportService } from '../../sales-box/sales-box-report.service';
import { error } from 'console';

@Component({
  selector: 'app-box-table',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    RouterLink
  ],
  templateUrl: './box-table.component.html',
  styles: ``
})
export class BoxTableComponent {
  @ViewChild('dt') dt!: Table;

  items = input.required<Box[]>()

  constructor(
    private _saleService: SaleService,
    private _reportService: SaleBoxReportService,
    private _settings: SettingsService) { }

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDatetimeToString(date)
  }

  getSeverityStatus(status: boolean) {
    if (status) {
      return 'success';
    } else {
      return 'secondary';
    }
  }

  getStatus(status: boolean) {
    if (status) {
      return 'Abierta';
    } else {
      return 'Cerrada';
    }
  }

  async onGenerateReport(box: Box) {
    this._settings.showSpinner();
    this._saleService.getSalesByBoxId(box.id!)
      .then(async (sales) => {
        try {
          await this._reportService.generateReport(box, sales);
        } catch (error) {
          console.log('Error al generar reporte', error)
          this._settings.showMessage('error', 'Reporte', 'Error al generar reporte')
        } finally {
          this._settings.hideSpinner();
        }
      })
      .catch(error => {
        this._settings.hideSpinner();
        console.log('Error al consultar ventas', error)
        this._settings.showMessage('error', 'Reporte', 'Error al consultar ventas')
      });
  }
}

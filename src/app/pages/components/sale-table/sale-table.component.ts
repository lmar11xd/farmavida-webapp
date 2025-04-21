import { CommonModule } from '@angular/common';
import { Component, input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { Timestamp } from '@angular/fire/firestore';
import { Sale } from '../../../core/models/sale';
import { convertDateToFormat } from '../../../core/core-util';

@Component({
  selector: 'app-sale-table',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './sale-table.component.html',
  styles: ``
})
export class SaleTableComponent {

  @ViewChild('dt') dt!: Table;
  sales = input.required<Sale[]>()

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDateToFormat(date, 'dd/MM/yyyy')
  }

  onViewSale(sale: Sale) {
    console.log(sale)
  }

  onDownloadTicket(sale: Sale) {
    console.log(sale)
  }
}

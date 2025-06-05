import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { Timestamp } from '@angular/fire/firestore';
import { Sale } from '../../../core/models/sale';
import { convertDatetimeToString } from '../../../core/core-util';
import { VoucherComponent } from "../voucher/voucher.component";
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-sale-table',
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    VoucherComponent,
    Dialog
],
  templateUrl: './sale-table.component.html',
  styles: ``
})
export class SaleTableComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  @Input() sales: Sale[] = [];
  selectedSale: Sale | null = null;
  visibleView: boolean = false

  constructor() {}

  onFilter(event: Event, dt: Table) {
    const input = event.target as HTMLInputElement;
    dt.filter(input.value, 'global', 'contains');
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDatetimeToString(date)
  }

  onViewSale(sale: Sale) {
    this.selectedSale = sale;
    this.visibleView = true;
  }

  dismissView() {
    this.visibleView = false
    this.selectedSale = null
  }

}

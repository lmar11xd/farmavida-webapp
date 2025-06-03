import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  @ViewChild('dt') dt!: Table;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  @Input() sales: Sale[] = [];
  selectedSale: Sale | null = null;
  visibleView: boolean = false

  constructor() {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDatetimeToString(date)
  }

  onViewSale(sale: Sale) {
    this.selectedSale = sale;
    this.visibleView = true;
  }

  dismissView(event: any) {
    this.visibleView = false
    this.selectedSale = null
  }

}

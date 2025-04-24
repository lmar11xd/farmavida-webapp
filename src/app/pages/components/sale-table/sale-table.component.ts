import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { Timestamp } from '@angular/fire/firestore';
import { Sale } from '../../../core/models/sale';
import { convertDateToFormat } from '../../../core/core-util';
import { TicketComponent } from "../ticket/ticket.component";

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
    TicketComponent
],
  templateUrl: './sale-table.component.html',
  styles: ``
})
export class SaleTableComponent {
  @ViewChild('dt') dt!: Table;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  sales = input.required<Sale[]>()
  selectedSale: Sale | null = null;

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDateToFormat(date, 'dd/MM/yyyy')
  }

  onViewSale(sale: Sale) {
    this.selectedSale = sale
    console.log(sale)
  }

}

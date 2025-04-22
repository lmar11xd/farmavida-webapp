import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { Timestamp } from '@angular/fire/firestore';
import jsPDF from 'jspdf';
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

  onDownloadTicket(sale: Sale) {
    this.selectedSale = sale
    this.printTicket(sale.code)
  }

  async printTicket(code: string) {
    // Esperar un ciclo para que el DOM se actualice
    await new Promise(resolve => setTimeout(resolve, 200));

    const input = this.pdfContent.nativeElement;

    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.html(input, {
      callback: function (pdf) {
        pdf.save(`BOLETA_${code}.pdf`);
      },
      x: 5,
      y: 5,
      html2canvas: {
        scale: 0.25,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: null,
      },
    })
  }
}

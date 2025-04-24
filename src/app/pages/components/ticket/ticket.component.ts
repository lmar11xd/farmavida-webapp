import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import { Sale } from '../../../core/models/sale';
import { ButtonModule } from 'primeng/button';
import { Timestamp } from '@angular/fire/firestore';
import { convertDatetimeToString } from '../../../core/core-util';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule, ButtonModule, QRCodeComponent],
  templateUrl: './ticket.component.html',
  styles: ``
})
export class TicketComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  sale = input.required<Sale>()
  buttonShort = input.required<boolean>()
  @Output() onGeneratedTicket = new EventEmitter<string>();

  ruc: string = '20512345678';
  qrData: string = 'RUC|CODIGO|FECHA|MONEDA|TOTAL';

  getFormatDatetime(date: Timestamp | Date | null | undefined) {
    return convertDatetimeToString(date)
  }

  async generatePDF() {
    const code = this.sale().code;
    const dateStr = this.getFormatDatetime(this.sale().saleDate);

    this.qrData = `RUC:${this.ruc}|CODIGO:${code}|FECHA:${dateStr}|MONEDA:SOLES|TOTAL:${this.sale().total}`;

    // Esperar un ciclo para que el DOM se actualice
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      // Esperar un ciclo para que el DOM se actualice
      await new Promise(resolve => setTimeout(resolve, 200));

      const input = this.pdfContent.nativeElement;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFont('Helvetica')
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
          letterRendering: true
        },
      })
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      this.onGeneratedTicket.emit(this.sale().code);
    }
  }

}


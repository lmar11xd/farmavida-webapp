import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Sale } from '../../../core/models/sale';
import { Timestamp } from '@angular/fire/firestore';
import { convertDatetimeToString } from '../../../core/core-util';

@Component({
  selector: 'app-voucher',
  imports: [CommonModule, ButtonModule],
  templateUrl: './voucher.component.html',
  styles: ``
})
export class VoucherComponent {
  sale = input.required<Sale>()
  ruc: string = '20512345678';
  qrData: string = 'RUC|CODIGO|FECHA|MONEDA|TOTAL';

  getFormatDatetime(date: Timestamp | Date | null | undefined) {
    return convertDatetimeToString(date)
  }

  padEnd(text: string, length: number): string {
    return text.padEnd(length, ' ');
  }

  padStart(text: string, length: number): string {
    return text.padStart(length, ' ');
  }

  getThermalTicketLines(): string[] {
    const lines: string[] = [];
    const sale = this.sale();

    // Encabezado
    lines.push('        FARMAVIDA');
    lines.push('     RUC: 20512345678');
    lines.push(' Av. Los Negocios 123, Lima');
    lines.push('-------------------------------');
    lines.push('     BOLETA DE VENTA');
    lines.push(`     N°: ${sale.code}`);
    lines.push('-------------------------------');

    // Fecha, cliente, vendedor
    lines.push(`FECHA: ${this.getFormatDatetime(sale.saleDate)}`);
    //lines.push(`CLIENTE: ${sale.createdBy || '---'}`);
    lines.push(`VENDEDOR: ${sale.createdBy}`);
    lines.push('MONEDA: SOLES');
    lines.push('-------------------------------');

    // Detalle de productos
    lines.push('PRODUCTO    CANT  P.U.   IMPORTE');
    lines.push('-------------------------------');

    for (const p of sale.products) {
      const name = p.name.substring(0, 10).padEnd(10);
      const qty = p.quantity.toString().padStart(4);
      const pu = p.salePrice.toFixed(2).padStart(6);
      const imp = (p.salePrice * p.quantity).toFixed(2).padStart(7);
      lines.push(`${name}${qty}${pu}${imp}`);
    }

    lines.push('-------------------------------');
    lines.push(`TOTAL:             S/ ${sale.total.toFixed(2)}`);
    lines.push('-------------------------------');

    // Código QR en texto
    /*const qr = `RUC:${this.ruc}|CODIGO:${sale.code}|FECHA:${this.getFormatDatetime(sale.saleDate)}|MONEDA:SOLES|TOTAL:${sale.total}`;
    lines.push('QR:');
    lines.push(qr.substring(0, 32));
    if (qr.length > 32) lines.push(qr.substring(32, 64));
    if (qr.length > 64) lines.push(qr.substring(64, 96));*/

    // Mensaje final
    lines.push('');
    lines.push('  GRACIAS POR SU COMPRA');
    lines.push('');
    lines.push('');

    return lines;
  }

  printThermal() {
    const printContents = document.getElementById('thermal-ticket')?.innerHTML;
    const printWindow = window.open('', '', 'width=600,height=800');
    if (printWindow && printContents) {
      const doc = printWindow.document;

      // Crear el <html> y <head> manualmente
      const html = doc.documentElement;
      const head = doc.head || doc.createElement('head');
      const body = doc.body || doc.createElement('body');

      // Crear e insertar el <style>
      const style = doc.createElement('style');
      style.textContent = `
        @media print {
          body {
            margin: 0;
            font-family: monospace;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td, th {
            padding: 2px;
          }
          .center {
            text-align: center;
          }
          .right {
            text-align: right;
          }
          .bold {
            font-weight: bold;
          }
        }
      `;
      head.appendChild(style);
      doc.head.replaceWith(head);

      // Crear e insertar el contenido
      const contentDiv = doc.createElement('div');
      contentDiv.innerHTML = printContents;
      body.appendChild(contentDiv);
      doc.body.replaceWith(body);

      // Esperar a que el DOM esté listo y luego imprimir
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  }

  printThermal58mm() {
    const content = document.getElementById('thermal-text-ticket')?.innerHTML;
    const printWindow = window.open('', '', 'width=300,height=600');

    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 10px;
                  font-family: monospace;
                  font-size: 10px;
                  width: 58mm;
                }
                pre {
                  white-space: pre;
                  word-wrap: break-word;
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}

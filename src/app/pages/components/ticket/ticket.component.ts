import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Sale } from '../../../core/models/sale';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule, ButtonModule, QRCodeComponent],
  templateUrl: './ticket.component.html',
  styles: `table, th, td {
    border: 1px solid black;
  }
  th {
    background-color: #f2f2f2;
  }`
})
export class TicketComponent {
  sale = input.required<Sale>()

  productos = [
    { nombre: 'Producto A', cantidad: 2, precio: 10, total: 20 },
    { nombre: 'Producto B', cantidad: 1, precio: 15, total: 15 },
    { nombre: 'Producto A', cantidad: 2, precio: 10, total: 20 },
    { nombre: 'Producto B', cantidad: 1, precio: 15, total: 15 },
    { nombre: 'Producto A', cantidad: 2, precio: 10, total: 20 },
    { nombre: 'Producto B', cantidad: 1, precio: 15, total: 15 },
    { nombre: 'Producto A', cantidad: 2, precio: 10, total: 20 },
    { nombre: 'Producto B', cantidad: 1, precio: 15, total: 15 },
    { nombre: 'Producto A', cantidad: 2, precio: 10, total: 20 },
    { nombre: 'Producto B', cantidad: 1, precio: 15, total: 15 },
  ];

  qrData: string = '';

  get total() {
    return this.productos.reduce((sum, p) => sum + p.total, 0);
  }

  async generatePDF() {
    const nombreArchivo: string = 'boleta_venta_001';
    const boletaId = '001';
    const ruc = '12345678901';
    const total = this.total.toFixed(2);
    const fecha = new Date().toISOString().split('T')[0];
    this.qrData = `RUC:${ruc}|BOLETA:${boletaId}|FECHA:${fecha}|TOTAL:S/${total}`;

    const container = document.querySelector('.d-none');
    const header = document.getElementById('ticket-header');
    const body = document.getElementById('ticket-body');

    if (!header || !body || !container) return;

    // Mostrar temporalmente el contenido
    container.classList.remove('d-none');

    // Esperar un ciclo para que el DOM se actualice
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const headerCanvas = await html2canvas(header, { scale: 2 });
      const bodyCanvas = await html2canvas(body, { scale: 2 });

      const headerImg = headerCanvas.toDataURL('image/png');
      const bodyImg = bodyCanvas.toDataURL('image/png');

      const headerHeightPx = headerCanvas.height;
      const headerWidthPx = headerCanvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const headerHeightMm = (headerHeightPx * pageWidth) / headerWidthPx;
      const usablePageHeight = pageHeight - headerHeightMm;

      const bodyProps = pdf.getImageProperties(bodyImg);
      const bodyHeightMm = (bodyProps.height * pageWidth) / bodyProps.width;

      let heightLeft = bodyHeightMm;
      let position = headerHeightMm;

      while (heightLeft > 0) {
        pdf.addImage(headerImg, 'PNG', 0, 0, pageWidth, headerHeightMm);
        pdf.addImage(bodyImg, 'PNG', 0, position, pageWidth, bodyHeightMm);

        heightLeft -= usablePageHeight;

        if (heightLeft > 0) {
          pdf.addPage();
          position = headerHeightMm;
        }
      }

      pdf.save(`${nombreArchivo}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      // Ocultar nuevamente el contenido
      container.classList.add('d-none');
    }
  }

}

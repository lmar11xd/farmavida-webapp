import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Box } from '../../core/models/box';
import { Sale } from '../../core/models/sale';
import { toDate } from '../../core/core-util';

@Injectable({ providedIn: 'root' })
export class SaleBoxReportService {
  async generateReport(box: Box, sales: Sale[]) {
    const openingDate = toDate(box.openingDate)
    const closingDate = toDate(box.closingDate)

    const data: any[][] = [
      ['REPORTE DE CIERRE DE CAJA'],
      [],
      ['Codigo', box.code],
      ['Fecha de Apertura', openingDate?.toLocaleString()],
      ['Fecha de Cierre', closingDate?.toLocaleString()],
      ['Monto Inicial (S/)', box.initialAmount],
      ['Monto Sistema (S/)', box.systemAmount],
      ['Monto Contado (S/)', box.cashAmount],
      ['Diferencia (S/)', box.difference],
      ['Vendedor', box.createdBy],
      [],
      ['VENTAS DEL TURNO'],
      ['Codigo', 'Fecha', 'Total']
    ];

    sales.forEach(v => {
      const saleDate = toDate(v.saleDate)

      data.push([
        v.code,
        saleDate?.toLocaleString(),
        v.total
      ]);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cierre de Caja');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const nombreArchivo = `REPORTECAJA_${box.code}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    saveAs(blob, nombreArchivo);
  }
}

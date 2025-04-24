import { Timestamp } from '@angular/fire/firestore';
import { PREFIX_SALE_TICKET } from './constants/constants';

export function isEmpty(obj: any) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
}

export function convertExcelDateString(excelSerial: number): string {
    const excelStartDate = new Date(1899, 11, 30); // Base de Excel
    const resultDate = new Date(excelStartDate.getTime() + excelSerial * 86400000);
    return resultDate.toISOString().split('T')[0]; // Retorna formato 'YYYY-MM-DD'
}

export function convertExcelDate(excelSerial: number): Date {
    const excelStartDate = new Date(1899, 11, 30); // Base de Excel
    const resultDate = new Date(excelStartDate.getTime() + excelSerial * 86400000);
    return resultDate;
}

export function convertExcelDateToEndOfMonth(excelSerial: number): Date {
    const excelStartDate = new Date(1899, 11, 30); // Base de Excel
    const tempDate = new Date(excelStartDate.getTime() + excelSerial * 86400000);

    // Obtener el último día del mes
    const lastDay = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0);

    return lastDay;
}

export function convertDateToFormat(date: Timestamp | Date | null | undefined, format: string): string {
    if(date == undefined || date == null) return ''

    if(date instanceof Timestamp) {
      date = (date as Timestamp).toDate()
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es base 0
    const year = String(date.getFullYear());

    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year);
}

export function convertDatetimeToString(date: Timestamp | Date | null | undefined): string {
  if(date == undefined || date == null) return ''

  if(date instanceof Timestamp) {
    date = (date as Timestamp).toDate()
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Los meses empiezan desde 0
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function getSeverityExpiration(expirationDate: Timestamp | Date | null | undefined): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
  if(expirationDate == undefined || expirationDate == null) return undefined;

  if(expirationDate instanceof Timestamp) {
    expirationDate = (expirationDate as Timestamp).toDate()
  }

  const currentDate = new Date();
  const timeDifference = expirationDate.getTime() - currentDate.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24); // Convertir la diferencia de tiempo en días

  if (daysDifference > 10) {
      return 'success';
  } else if (daysDifference <= 10 && daysDifference > 0) {
      return 'warn';
  } else if (daysDifference <= 0) {
      return 'danger';
  }

  return undefined;
}

export function generateCodeDate(): string {
  const ahora = new Date();

  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const hora = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');
  const milisegundos = String(ahora.getMilliseconds()).padStart(3, '0');

  return `${PREFIX_SALE_TICKET}-${año}${mes}${dia}${hora}${minutos}${segundos}${milisegundos}`;
}

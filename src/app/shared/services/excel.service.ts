import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';

const PRODUCTCOLUMNS = [
    'CODIGO',
    'PRODUCTO FARMACEUTICO',
    'PRINCIPIO ACTIVO',
    'LABORATORIO',
    'PRECIO COSTO',
    'UNIDAD DE MEDIDA',
    'FECHA DE VENCIMIENTO',
    'LOTE',
    'REGISTRO SANITARIO',
    'CANTIDAD',
    'PRECIO VENTA'
  ];

@Injectable({providedIn: 'root'})
export class ExcelService {
    constructor() {}

    readExcel(fileList: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            /*const target: DataTransfer = <DataTransfer>event.target;
            if (target.files.length !== 1) {
              reject('Solo se permite un archivo a la vez.');
              return;
            }*/
        
            const file = fileList.files[0];
            const reader: FileReader = new FileReader();
        
            reader.onload = (e: any) => {
              // El resultado es un ArrayBuffer
              const arrayBuffer: ArrayBuffer = e.target.result;
              // Lo convertimos a Uint8Array
              const data = new Uint8Array(arrayBuffer);
              // Cargamos el workbook usando XLSX
              const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
        
              // Se asume que la información está en la primera hoja
              const sheetName: string = workbook.SheetNames[0];
              const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        
              // Lee la hoja como un array de arrays, donde la primera fila son los encabezados
              const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
              if (sheetData.length === 0) {
                reject('El archivo está vacío o no tiene datos.');
                return;
              }
        
              // Primera fila = encabezados
              const headers = sheetData[0];
        
              // Validar encabezados requeridos
              const missingColumns = PRODUCTCOLUMNS.filter(col => !headers.includes(col));
              if (missingColumns.length > 0) {
                reject(`Faltan las siguientes columnas en el Excel: ${missingColumns.join(', ')}`);
                return;
              }
        
              // Convertir las filas siguientes en objetos, tomando como clave cada encabezado
              const dataRows = sheetData.slice(1).map(row => {
                const obj: any = {};
                headers.forEach((header: string, index: number) => {
                  obj[header] = row[index] !== undefined ? row[index] : null;
                });
                return obj;
              });
        
              // dataRows contiene un arreglo de objetos con las columnas correctas
              resolve(dataRows);
            };
        
            reader.onerror = (error) => reject(error);
            // Usamos readAsArrayBuffer en lugar de readAsBinaryString
            reader.readAsArrayBuffer(file);
        })
    }
}
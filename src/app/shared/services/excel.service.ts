import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';
import { Product } from "../../core/models/product";
import { convertExcelDateToEndOfMonth } from "../../core/core-util";
import { StatusEntryEnum } from '../../core/enums/status-entry.enum';

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

    readExcelProducts(file: any): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            /*const target: DataTransfer = <DataTransfer>event.target;
            if (target.files.length !== 1) {
              reject('Solo se permite un archivo a la vez.');
              return;
            }*/

            //const file = fileList.files[0];
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
              const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

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

              const products: Product[] = []
              sheetData.slice(1).forEach(row => {
                if(row[1] !== undefined && row[1] !== null
                  && row[9] !== undefined && row[9] !== null
                  && row[10] !== undefined && row[10] !== null
                ) {
                  var expDate = null
                  var costPrice = 0

                  if(row[4] !== undefined || row[4] !== null) {
                    costPrice = parseFloat(row[4])
                  }

                  if(row[6] !== undefined || row[6] !== null) {
                    expDate = convertExcelDateToEndOfMonth(row[6])
                  }

                  const product: Product = {
                    code: '00000000',
                    name: row[1].toString().trim(),
                    description: row[2] || null,
                    laboratory: row[3],
                    costPrice: costPrice,
                    um: row[5] || null,
                    expirationDate: expDate,
                    lot: row[7] || null,
                    sanitaryReg: row[8] || null,
                    quantity: row[9],
                    salePrice: row[10],
                    processingStatus: StatusEntryEnum.UNPROCESSED
                  }

                  products.push(product)
                }
              })

              resolve(products);
            };

            reader.onerror = (error) => reject(error);
            // Usamos readAsArrayBuffer en lugar de readAsBinaryString
            reader.readAsArrayBuffer(file);
        })
    }
}

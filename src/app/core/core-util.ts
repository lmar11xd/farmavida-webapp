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

export function convertDateToFormat(date: Date | null | undefined, format: string): string {
    if(date == undefined || date == null) return ''

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es base 0
    const year = String(date.getFullYear());

    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year);
}

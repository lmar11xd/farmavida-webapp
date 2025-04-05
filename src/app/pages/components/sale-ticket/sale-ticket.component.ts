import { Component, Input } from '@angular/core';
import { Sale } from '../../../core/models/sale';

@Component({
  selector: 'app-sale-ticket',
  imports: [],
  templateUrl: './sale-ticket.component.html',
  styles: ``
})
export class SaleTicketComponent {
  @Input() sale!: Sale;

  constructor() {}

  printTicket() {
    const printContent = document.getElementById('ticket')!.innerHTML;
    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(`
        <html>
        <head>
          <title>Boleta de Venta</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${printContent}
          <script>window.print(); window.close();</script>
        </body>
        </html>
      `);
      ventana.document.close();
    }
  }

}

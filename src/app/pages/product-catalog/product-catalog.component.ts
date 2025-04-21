import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Timestamp } from '@angular/fire/firestore';
import { CatalogTableComponent } from "../components/catalog-table/catalog-table.component";
import { Product } from '../../core/models/product';
import { ProductCatalogService } from './product-catalog.service';
import { SettingsService } from '../../core/settings/settings.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { LISTAR_CATALOGO } from '../../shared/breadcrumb/breadcrumb';
import { ShoppingCartComponent } from "../components/shopping-cart/shopping-cart.component";
import { Sale } from '../../core/models/sale';
import { convertDateToFormat } from '../../core/core-util';
import { TicketComponent } from "../components/ticket/ticket.component";

@Component({
  selector: 'app-product-catalog',
  imports: [CommonModule, Dialog, CatalogTableComponent, ButtonModule, ShoppingCartComponent, TicketComponent],
  templateUrl: './product-catalog.component.html',
  styles: ``
})
export default class ProductCatalogComponent implements OnInit {
  visibleSuccesfulSale: boolean = false;
  products: Product[] = [];
  saleCompleted: Sale | null = null;

  constructor(
    private _productCatalogService: ProductCatalogService,
    private _settings: SettingsService,
    private _breadcrumService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initialize()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs(LISTAR_CATALOGO);
  }

  initialize() {
    this._settings.showSpinner()
    this._productCatalogService.getProducts()
      .subscribe({
        next: (data) => {
          this.products = data;
          this._settings.hideSpinner();
        },
        error: (error) => {
          console.error('Error', error);
          this._settings.hideSpinner();
        }
      });
  }

  onRemovedProduct(product: Product) {
    // Actualizar el producto en el catálogo
    const productIndex = this.products.findIndex(p => p.id === product.id);
    if (productIndex !== -1) {
      this.products[productIndex].quantity += product.quantity;
    }
  }

  onSuccesfulSale(sale: Sale) {
    this.visibleSuccesfulSale = true;
    this.saleCompleted = sale;
    console.log('Venta exitosa:', sale);
  }

  closeDialog() {
    this.visibleSuccesfulSale = false;
  }

  generateSaleTicket() {
    console.log('Generando recibo de venta...');
    this.closeDialog()
    this.printTicket()
  }

  printTicket() {
    const printContent = document.getElementById('ticket');
    if (!printContent) return;

    const ventana = window.open('', '_blank');
    if (ventana) {
      // Crear el contenido HTML completo de forma segura
      const doc = ventana.document;

      // Crear head
      const head = doc.createElement('head');
      const title = doc.createElement('title');
      title.innerText = 'Boleta de Venta';

      const style = doc.createElement('style');
      style.innerHTML = `
        body { font-family: Arial, sans-serif; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      `;

      head.appendChild(title);
      head.appendChild(style);
      doc.head.replaceWith(head);

      // Crear body
      const body = doc.body;
      body.innerHTML = printContent.innerHTML;

      // Esperar a que se cargue el contenido antes de imprimir
      ventana.onload = () => {
        ventana.focus();
        ventana.print();
        ventana.close();
      };
    }
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDateToFormat(date, 'dd/MM/yyyy')
  }
}

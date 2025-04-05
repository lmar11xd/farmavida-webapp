import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { CatalogTableComponent } from "../components/catalog-table/catalog-table.component";
import { Product } from '../../core/models/product';
import { ProductCatalogService } from './product-catalog.service';
import { SettingsService } from '../../core/settings/settings.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { LISTAR_CATALOGO } from '../../shared/breadcrumb/breadcrumb';
import { ShoppingCartComponent } from "../components/shopping-cart/shopping-cart.component";
import { Sale } from '../../core/models/sale';

@Component({
  selector: 'app-product-catalog',
  imports: [Dialog, CatalogTableComponent, ButtonModule, ShoppingCartComponent],
  templateUrl: './product-catalog.component.html',
  styles: ``
})
export default class ProductCatalogComponent {
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
  }

  closeDialog() {
    this.visibleSuccesfulSale = false;
  }

  generateSaleTicket() {
    console.log('Generando recibo de venta...');
    this.closeDialog()
  }
}

import { Component } from '@angular/core';
import { CatalogTableComponent } from "../components/catalog-table/catalog-table.component";
import { Product } from '../../core/models/product';
import { ProductCatalogService } from './product-catalog.service';
import { SettingsService } from '../../core/settings/settings.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { LISTAR_CATALOGO } from '../../shared/breadcrumb/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ShoppingCartComponent } from "../components/shopping-cart/shopping-cart.component";
import { ShoppingCartService } from '../components/shopping-cart/shopping-cart.setvice';

@Component({
  selector: 'app-product-catalog',
  imports: [CatalogTableComponent, ButtonModule, ShoppingCartComponent],
  templateUrl: './product-catalog.component.html',
  styles: ``
})
export default class ProductCatalogComponent {
  products: Product[] = []

  constructor(
    private _productCatalogService: ProductCatalogService,
    private _settings: SettingsService,
    private _breadcrumService: BreadcrumbService
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
}

import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { SettingsService } from '../../../core/settings/settings.service';
import { LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-list',
  imports: [ButtonModule, RouterLink, ProductTableComponent],
  templateUrl: './product-list.component.html',
  styles: ``
})
export default class ProductListComponent implements OnInit {
  products: Product[] = []

  constructor(
    private _productService: ProductService,
    private _settings: SettingsService,
    private _breadcrumService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initialize()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs(LISTAR_PRODUCTO);
  }

  initialize() {
    this._settings.showSpinner()
    this._productService.getProducts()
      .subscribe({
        next: (data) => {
          this.products = data;
          this._settings.hideSpinner();
        },
        error: (error) => {
          console.error('Error al obtener datos', error);
          this._settings.hideSpinner();
        }
      });
  }
}

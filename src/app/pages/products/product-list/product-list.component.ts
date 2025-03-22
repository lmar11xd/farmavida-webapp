import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button'
import { Product, ProductService } from '../product.service';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { SettingsService } from '../../../core/settings/settings.service';
import { LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-product-list',
  imports: [ButtonModule, ProductTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
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
    this._productService.getCollection<Product>('products')
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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { Product } from '../../../core/models/product';
import { ShoppingCartService } from './shopping-cart.setvice';
import { ProductService } from '../../products/product.service';
import { Sale } from '../../../core/models/sale';
import { SettingsService } from '../../../core/settings/settings.service';
import { SaleService } from '../../sales/sales.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, DrawerModule, DataViewModule, DividerModule, ButtonModule],
  templateUrl: './shopping-cart.component.html',
  styles: ''
})
export class ShoppingCartComponent implements OnInit {
  @Output() onRemovedProduct = new EventEmitter<Product>();
  @Output() onSuccessfulSale = new EventEmitter<Sale>();
  visible: boolean = false;
  produtcs: Product[] = []
  total: number = 0;

  constructor(
    private _shoppingCartService: ShoppingCartService,
    private _saleService: SaleService,
    private _productService: ProductService,
    private _settings: SettingsService
  ) {}

  ngOnInit(): void {
    this._shoppingCartService.cart$.subscribe(data => {
      this.produtcs = data
      this.total = this._shoppingCartService.getTotal()
    })
  }

  show() {
    this.visible = true
  }

  dismiss() {
    this.visible = false
  }

  deleteProduct(product: Product) {
    if(product.id && product.quantity > 0) {
      this._shoppingCartService.deleteProduct(product.id)

      // Emitimos el producto eliminado
      this.onRemovedProduct.emit(product);
    }
  }

  cleanCart() {
    this._shoppingCartService.clean()
  }

  async finalizePurchase() {
    if (this.produtcs.length === 0) return;

    try {
      this._settings.showSpinner();

      const productsSold = this.produtcs;
      const total = productsSold.reduce((acc, prod) => acc + prod.salePrice * prod.quantity, 0);

      const currentDate = new Date();
      const sale: Sale = {
        code: '',
        products: productsSold,
        total: total,
        saleDate: currentDate,
        createdAt: currentDate,
        createdBy: this._settings.getUserInfo()?.username || 'admin',
      };

      // Registrar la venta
      const data = await this._saleService.create(sale);
      console.log('Venta registrada:', data);

      // Actualizar stock de cada producto en secuencia
      for (const product of this.produtcs) {
        await this._productService.updateStock(product.id!, product.quantity);
      }

      this.onSuccessfulSale.emit(data.sale);

      // Limpiar carrito y cerrar modal
      this._shoppingCartService.clean();
      this.dismiss();
    } catch (error) {
      console.error('Error en la compra:', error);
      this._settings.showMessage('error', 'Error en la compra', 'Ocurrió un error al procesar la compra. Intente nuevamente.');
    } finally {
      this._settings.hideSpinner();
    }
  }
}

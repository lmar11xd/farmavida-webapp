import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { Product } from '../../../core/models/product';
import { ShoppingCartService } from './shopping-cart.setvice';
import { ProductCatalogService } from '../../product-catalog/product-catalog.service';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, DrawerModule, DataViewModule, DividerModule, ButtonModule],
  templateUrl: './shopping-cart.component.html',
  styles: ''
})
export class ShoppingCartComponent implements OnInit {
  visible: boolean = false;
  produtcs: Product[] = []
  total: number = 0;

  constructor(
    private _shoppingCartService: ShoppingCartService,
    private _productCatalogService: ProductCatalogService,
    private _productService: ProductService
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

  deleteProduct(id: string) {
    this._shoppingCartService.deleteProduct(id)
  }

  cleanCart() {
    this._shoppingCartService.clean()
  }

  async finalizePurchase() {
    if (this.produtcs.length === 0) return;

    try {
      // Registrar la venta
      await this._productCatalogService.registerSale(this.produtcs);

      // Actualizar stock de cada producto en secuencia
      for (const product of this.produtcs) {
        await this._productService.updateStock(product.id!, product.quantity);
      }

      // Limpiar carrito y cerrar modal
      this._shoppingCartService.clean();
      this.dismiss();
      alert('Compra realizada con éxito');
    } catch (error) {
      console.error('Error en la compra:', error);
      alert('Ocurrió un error al procesar la compra. Intente nuevamente.');
    } 
  }
}

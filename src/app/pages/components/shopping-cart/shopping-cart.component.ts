import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { Firestore } from '@angular/fire/firestore';
import { runTransaction } from "firebase/firestore";
import { Product } from '../../../core/models/product';
import { ShoppingCartService } from './shopping-cart.service';
import { ProductService } from '../../products/product.service';
import { Sale } from '../../../core/models/sale';
import { SettingsService } from '../../../core/settings/settings.service';
import { SaleService } from '../../sales/sales.service';
import { SalesBoxService } from '../../sales-box/sales-box.service';
import { PREFIX_SALE } from '../../../core/constants/constants';

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
  products: Product[] = []
  total: number = 0;

  userId: string = '';
  username: string = '';

  constructor(
    private _shoppingCartService: ShoppingCartService,
    private _saleService: SaleService,
    private _productService: ProductService,
    private _salesBoxService: SalesBoxService,
    private _settings: SettingsService,
    private _firestore: Firestore
  ) {}

  ngOnInit(): void {
    const user = this._settings.getUserInfo();
    this.userId = user?.id || '';
    this.username = user?.username || '';

    this._shoppingCartService.cart$.subscribe(data => {
      this.products = data
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

  async finalizePurchaseV1() {
    if (this.products.length === 0) return;

    try {
      this._settings.showSpinner();

      // 1. Verificar caja abierta
      const boxDoc = await this._salesBoxService.getOpenBox(this.userId);
      if (!boxDoc) {
        this._settings.showMessage('warn', 'Caja no abierta', 'Debe abrir una caja para realizar una venta.');
        return;
      }

      // 2. Calcular total de la venta y validar
      const productsSold = this.products;
      const total = productsSold.reduce((acc, prod) => acc + prod.salePrice * prod.quantity, 0);

      if (total <= 0) {
        this._settings.showMessage('warn', 'Total inválido', 'El total de la venta debe ser mayor a cero.');
        return;
      }

      // 3. Validar stock antes de continuar
      const stockBackup: { id: string, stock: number }[] = [];
      for (const product of productsSold) {
        const current = await this._productService.getProduct(product.id!);
        const currentProduct = current.data() as Product;

        if (currentProduct.quantity < product.quantity) {
          this._settings.showMessage('warn', 'Stock insuficiente', `No hay suficiente stock para el producto "${product.name}".`);
          return;
        }

        stockBackup.push({ id: product.id!, stock: currentProduct.quantity });
      }

      // 4. Registrar la venta
      const boxId = boxDoc.id;
      const currentDate = new Date();
      const sale: Sale = {
        code: '', // Podrías generar un código único aquí si lo deseas
        sellerId: this.userId,
        boxId: boxId,
        products: productsSold,
        total: total,
        saleDate: currentDate,
        createdAt: currentDate,
        createdBy: this.username,
      };

      const data = await this._saleService.create(sale);

      // 5. Intentar actualizar stock
      try {
        await Promise.all(
          productsSold.map(product =>
            this._productService.updateStock(product.id!, product.quantity)
          )
        );
      } catch (stockUpdateError) {
        // 6. Revertir cambios si falla la actualización
        await Promise.all(
          stockBackup.map(item =>
            this._productService.setStock(item.id, item.stock)
          )
        );

        throw new Error('Falló la actualización del stock. Se revirtieron los cambios.');
      }

      // 7. Venta exitosa
      this.onSuccessfulSale.emit(data.sale);
      this._shoppingCartService.clean();
      this.dismiss();
    } catch (error: any) {
      console.error('Error en la compra:', error);
      this._settings.showMessage('error', 'Error en la compra', error.message || 'Ocurrió un error al procesar la compra. Intente nuevamente.');
    } finally {
      this._settings.hideSpinner();
    }
  }

  /**
   * Método mejorado para finalizar la compra
   *
   * Finaliza la compra, valida stock, registra la venta y actualiza el inventario.
   * Usa una transacción de Firebase para asegurar la atomicidad:
   * o se realiza la venta y se actualiza el stock completamente, o no se hace nada.
   * @returns {Promise<void>}
   */
  async finalizePurchase() {
    if (this.products.length === 0) return;

    try {
      this._settings.showSpinner();

      // 1. Verificar caja abierta
      const boxDoc = await this._salesBoxService.getOpenBox(this.userId);
      if (!boxDoc) {
        this._settings.showMessage('warn', 'Caja no abierta', 'Debe abrir una caja para realizar una venta.');
        return;
      }

      // 2. Calcular total de la venta y validar
      const productsSold = this.products;
      const total = productsSold.reduce((acc, prod) => acc + prod.salePrice * prod.quantity, 0);

      if (total <= 0) {
        this._settings.showMessage('warn', 'Total inválido', 'El total de la venta debe ser mayor a cero.');
        return;
      }

      const boxId = boxDoc.id;
      const currentDate = new Date();
      const saleRef = this._saleService.getNewSaleRef(); // Asume que esto devuelve un nuevo doc ref vacío

      // 3. Obtener Codigo de venta
      let saleCode = await this._saleService.generateSaleCode();

      // 4. Ejecutar transacción Firestore
      await runTransaction(this._firestore, async (transaction) => {
        // 🔹 Paso 4.1: leer todos los productos primero
        const productRefs = productsSold.map(p => this._productService.getProductRef(p.id!));
        const productSnaps = await Promise.all(productRefs.map(ref => transaction.get(ref)));

        // 🔹 Paso 4.2: validar stock
        productSnaps.forEach((snap, i) => {
          if (!snap.exists()) {
            throw new Error(`El producto "${productsSold[i].name}" no existe.`);
          }

          const current = snap.data() as Product;
          if (current.quantity < productsSold[i].quantity) {
            throw new Error(`Stock insuficiente para "${productsSold[i].name}".`);
          }
        });

        // 🔹 Paso 4.3: actualizar stock
        productSnaps.forEach((snap, i) => {
          const newQuantity = (snap.data() as Product).quantity - productsSold[i].quantity;
          transaction.update(productRefs[i], { quantity: newQuantity });
        });

        // 🔹 Paso 4.4: crear la venta
        const sale: Sale = {
          code: saleCode,
          sellerId: this.userId,
          boxId: boxId,
          products: productsSold,
          total: total,
          saleDate: currentDate,
          createdAt: currentDate,
          createdBy: this.username,
        };

        transaction.set(saleRef, sale);
      });

      // 5. Todo exitoso
      const saleData = await this._saleService.getByRef(saleRef); // O podrías devolver el objeto directamente si ya lo tienes
      this.onSuccessfulSale.emit(saleData);
      this._shoppingCartService.clean();
      this.dismiss();
    } catch (error: any) {
      console.error('Error en la compra:', error);
      this._settings.showMessage('error', 'Error en la compra', error.message || 'Ocurrió un error al procesar la compra.');
    } finally {
      this._settings.hideSpinner();
    }
  }
}

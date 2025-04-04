import { Component, input, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService } from 'primeng/api';
import { ProductEntry } from '../../../core/models/product-entry';
import { StatusEntryEnum } from '../../../core/enums/status-entry.enum';
import { Timestamp } from '@angular/fire/firestore';
import { convertDateToFormat } from '../../../core/core-util';
import { ProductEntryService } from '../../product-entry/product-entry.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { ProductCreate, ProductService } from '../../products/product.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-entry-table',
  providers: [ConfirmationService],
  imports: [
    TableModule,
    ButtonModule,
    ConfirmDialog,
    InputTextModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    Dialog
  ],
  templateUrl: './product-entry-table.component.html',
  styles: ``
})
export class ProductEntryTableComponent {
  @ViewChild('dt') dt!: Table;
  entries = input.required<ProductEntry[]>()
  status = StatusEntryEnum
  visibleView: boolean = false
  selectedEntry: ProductEntry | null = null

  constructor(
    private _confirmationService: ConfirmationService,
    private _settings: SettingsService,
    private _entryService: ProductEntryService,
    private _productService: ProductService
  ) {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getSeverityStatus(status: StatusEntryEnum | null | undefined) {
    switch (status) {
      case StatusEntryEnum.PROCESSED:
        return 'success'
      default:
        return 'secondary'
    }
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDateToFormat(date, 'dd/MM/yyyy')
  }

  onProcessEntry(id: string) {
    this.showDialogSaveProducts(id)
  }

  async onViewEntry(id: string) {
    this._settings.showSpinner()
    const entry = await this._entryService.getEntry(id)
    this._settings.hideSpinner()
    if(entry.exists()) {
      this.selectedEntry = entry.data() as ProductEntry
      this.selectedEntry.id = id
      this.visibleView = true
    }
  }

  onDeleteEntry(entry: ProductEntry) {

  }

  dismissView(event: any) {
    this.visibleView = false
    this.selectedEntry = null
  }

  showDialogSaveProducts(idEntry: string) {
    this._confirmationService.confirm({
      message: '¿Deseas procesar el documento?',
      header: 'Procesar Ingreso',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
          label: 'Procesar',
      },
      accept: () => {
        this.processEntry(idEntry)
      },
      reject: () => {
        console.log("Cancelar procesar ingreso de productos")
      }
    });
  }

  async processEntry(id: string) {
    console.log('Procesar ingreso de productos', id)
    try {
      this._settings.showSpinner()

      const entrySnapshot = await this._entryService.getEntry(id)

      if (!entrySnapshot.exists()) {
        this._settings.showMessage('warn', 'Advertencia', 'El ingreso de productos no existe');
        return;
      }

      const entry = entrySnapshot.data() as ProductEntry;
      if (!entry?.products || entry.products.length === 0) {
        console.log('No hay productos para procesar');
        this._settings.showMessage('warn', 'Advertencia', 'No hay productos para procesar');
        return;
      }

      const currentDate = new Date();
      const username = this._settings.getUserInfo()?.username || 'admin';

      // Procesar cada producto del ingreso
      for (const product of entry.products) {
        const productName = product.name.trim().toLowerCase();
        const existingProductSnapshot = await this._productService.getProductByName(productName);

        if (existingProductSnapshot?.exists()) {
          // Si el producto ya existe, actualizamos el stock
          const existingProduct = existingProductSnapshot.data() as Product;;
          const updatedStock = (existingProduct?.quantity || 0) + product.quantity;

          await this._productService.update(existingProductSnapshot.id, {
            costPrice: product.costPrice,
            salePrice: product.salePrice,
            quantity: updatedStock,
            updatedAt: currentDate,
            updatedBy: this._settings.getUserInfo()?.username || 'admin'
          });

          console.log(`Stock actualizado para ${product.name}: ${updatedStock}`);

        } else {
          // Si el producto no existe, lo creamos con el stock inicial
          const newProduct: ProductCreate = {
            code: '',
            name: product.name,
            quantity: product.quantity,
            description: product.description || '',
            expirationDate: product.expirationDate,
            costPrice: product.costPrice,
            salePrice: product.salePrice,
            um: product.um || '',
            lot: product.lot || '',
            laboratory: product.laboratory || '',
            sanitaryReg: product.sanitaryReg || '',
            processingStatus: StatusEntryEnum.PROCESSED,
            processingDate: currentDate,
            createdAt: currentDate,
            createdBy: username
          };

          await this._productService.create(newProduct);
          console.log(`Nuevo producto creado: ${product.name}`);
        }
      }

      const productEntry: ProductEntry = {
        ...entry,
        processingDate: currentDate,
        status: StatusEntryEnum.PROCESSED,
        username: username
      };

      await this._entryService.update(id, productEntry);

      console.log('Ingreso de productos procesado correctamente', id);
      this._settings.showMessage('success', 'Éxito', 'Ingreso de productos procesado correctamente');
    } catch (error) {
      console.error('Error al procesar ingreso de productos:', error);
      this._settings.showMessage('error', 'Error', 'Ocurrió un error al procesar el ingreso de productos');
    } finally {
      this._settings.hideSpinner()
    }
  }
}

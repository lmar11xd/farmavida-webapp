import { Component, input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService } from 'primeng/api';
import { Product } from '../../../core/models/product';
import { Timestamp } from '@angular/fire/firestore';
import { convertDateToFormat, getSeverityExpiration } from '../../../core/core-util';
import { SettingsService } from '../../../core/settings/settings.service';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-product-table',
  providers: [ConfirmationService],
  imports: [
    RouterLink,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialog,
    InputTextModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './product-table.component.html',
  styles: ``
})
export class ProductTableComponent {
  @ViewChild('dt') dt!: Table;

  products = input.required<Product[]>()

  productDialog: boolean = false;

  constructor(
    private _settings: SettingsService,
    private _confirmationService: ConfirmationService,
    private _productService: ProductService
  ) {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getExpirationFormat(expirationDate: Timestamp | Date | null | undefined) {
    if(expirationDate == null) {
      return 'No aplica';
    }

    return convertDateToFormat(expirationDate, 'dd/MM/yyyy')
  }

  getSeverityExpiration(expirationDate: Date) {
    if(expirationDate == null) {
      return 'secondary';
    }

    return getSeverityExpiration(expirationDate)
  }

  onDeleteProduct(product: Product) {
    this._confirmationService.confirm({
      message: '¿Deseas eliminar el producto "' + product.name + '"?',
      header: 'Eliminar Producto',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
          label: 'Si, Eliminar',
          severity: 'danger'
      },
      accept: () => {
        this.deleteProduct(product.id || '000');
      },
      reject: () => {
        console.log("Cancelar eliminar producto")
      }
    });
  }

  deleteProduct(id: string) {
    try {
      this._settings.showSpinner()
      this._productService.delete(id)
      this._settings.showMessage('success', 'Éxito', 'Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      this._settings.showMessage('error', 'Error', 'No se pudo eliminar el producto, intente más tarde');
    } finally {
      this._settings.hideSpinner()
    }
  }
}

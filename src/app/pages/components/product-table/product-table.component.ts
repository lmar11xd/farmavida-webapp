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
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../core/models/product';
import { Timestamp } from '@angular/fire/firestore';
import { convertDateToFormat, getSeverityExpiration } from '../../../core/core-util';

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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getExpirationFormat(expirationDate: Date) {
    return convertDateToFormat(expirationDate, 'dd/MM/yyyy')
  }

  getSeverityExpiration(expirationDate: Date) {
    return getSeverityExpiration(expirationDate)
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }
}

import { Component, input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-table',
  providers: [ConfirmationService],
  imports: [
    RouterLink, 
    TableModule, 
    ButtonModule, 
    ToastModule, 
    ToolbarModule, 
    ConfirmDialog, 
    InputTextModule,
    CommonModule, 
    FileUpload, 
    InputTextModule, 
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

  selectedProducts!: Product[] | null;
  
  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.selectedProducts = null;
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Products Deleted',
                life: 3000
            });
        }
    });
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

import { Component, effect, input, OnInit } from '@angular/core';
import { Product } from '../../products/product.service';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';

export interface Product2 {
  id: string,
  code: string,
  name: string,
  description: string,
  quantity: string,
  costPrice: number,
  salePrice: number,
  price: number,
  category: string,
  inventoryStatus: string
}

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-product-table',
  providers: [ConfirmationService],
  imports: [RouterLink, TableModule, ButtonModule, SelectModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, InputTextModule, FormsModule, IconFieldModule, InputIconModule],
  templateUrl: './product-table.component.html',
  styles: ``
})
export class ProductTableComponent implements OnInit {
  products = input.required<Product[]>()

  productDialog: boolean = false;

    products2!: Product2[];

    product!: Product2;

    selectedProducts!: Product2[] | null;

    submitted: boolean = false;

    statuses!: any[];

    cols!: Column[];

    exportColumns!: ExportColumn[];
  
  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) {
    effect(() => {
      console.log(this.products())
    })
  }

  ngOnInit(): void {
  }

loadDemoData() {
    this.cols = [
        { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
        { field: 'name', header: 'Product Name' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'costPrice', header: 'Cost Price' },
        { field: 'salePrice', header: 'Sale Price' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
}

  openNew() {
    //this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product2) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.products2 = this.products2.filter((val) => !this.selectedProducts?.includes(val));
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

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product2) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.products2 = this.products2.filter((val) => val.id !== product.id);
            //this.product = {};
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Deleted',
                life: 3000
            });
        }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
        if (this.products2[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warn';
        case 'OUTOFSTOCK':
            return 'danger';
            default:
              return 'success'
    }
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
        if (this.product.id) {
            this.products2[this.findIndexById(this.product.id)] = this.product;
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Updated',
                life: 3000
            });
        } else {
            this.product.id = this.createId();
            //this.product.image = 'product-placeholder.svg';
            this.products2.push(this.product);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Created',
                life: 3000
            });
        }

        this.products2 = [...this.products2];
        this.productDialog = false;
        //this.product = {};
    }
  }
}

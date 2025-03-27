import { Component, input, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from '../../../core/models/product';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.setvice';

@Component({
  selector: 'app-catalog-table',
  providers: [ConfirmationService],
  imports: [
    TableModule, 
    ButtonModule, 
    ToastModule, 
    ToolbarModule, 
    ConfirmDialog, 
    InputTextModule,
    CommonModule, 
    InputTextModule, 
    FormsModule, 
    IconFieldModule, 
    InputIconModule
  ],
  templateUrl: './catalog-table.component.html',
  styles: ``
})
export class CatalogTableComponent {

  @ViewChild('dt') dt!: Table;
  
  products = input.required<Product[]>()

  productDialog: boolean = false;

  selectedProducts!: Product[] | null;
  
  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private _shoppingCartService: ShoppingCartService
  ) {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  addToCart(product: Product) {
    if (product.quantity > 0) {
      this._shoppingCartService.add(product);
    } else {
      alert('Stock insuficiente');
    }
  }

}

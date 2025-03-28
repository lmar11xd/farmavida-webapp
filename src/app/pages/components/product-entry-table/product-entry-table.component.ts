import { Component, input, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductEntry } from '../../../core/models/product-entry';
import { StatusEntryEnum } from '../../../core/enums/status-entry.enum';

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
    TagModule
  ],
  templateUrl: './product-entry-table.component.html',
  styles: ``
})
export class ProductEntryTableComponent {
  @ViewChild('dt') dt!: Table;
  entries = input.required<ProductEntry[]>()

  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getSeverityStatus(status: StatusEntryEnum) {
    switch (status) {
      case StatusEntryEnum.PROCESSED:
        return 'success'
      default: 
        return 'secondary'
    }
}

  processEntry(entry: ProductEntry) {

  }

  viewEntry(entry: ProductEntry) {

  }

  deleteEntry(entry: ProductEntry) {
    
  }
}

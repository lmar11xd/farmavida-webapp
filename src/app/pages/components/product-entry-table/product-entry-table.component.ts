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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductEntry } from '../../../core/models/product-entry';
import { StatusEntryEnum } from '../../../core/enums/status-entry.enum';
import { Timestamp } from '@angular/fire/firestore';
import { convertDateToFormat } from '../../../core/core-util';

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
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
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
    if(date instanceof Timestamp) {
      date = (date as Timestamp).toDate()
    }
    return convertDateToFormat(date, 'dd/MM/yyyy')
  }

  processEntry(entry: ProductEntry) {

  }

  viewEntry(entry: ProductEntry) {
    this.visibleView = true
    entry.products.map(p => {
      p.expirationDate = p.expirationDate ? (p.expirationDate as Timestamp).toDate() : null
    })
    this.selectedEntry = entry
    //this.selectedEntry.products = products
  }

  
  dismissView(event: any) {
    this.visibleView = false
    this.selectedEntry = null
  }

  deleteEntry(entry: ProductEntry) {
    
  }
}

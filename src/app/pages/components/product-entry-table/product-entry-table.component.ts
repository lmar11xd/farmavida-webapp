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
import { ProductEntryService } from '../../product-entry/product-entry.service';
import { SettingsService } from '../../../core/settings/settings.service';

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
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _settings: SettingsService,
    private _entryService: ProductEntryService
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

  processEntry(id: string) {

  }

  async viewEntry(id: string) {
    this._settings.showSpinner()
    const entry = await this._entryService.getEntry(id)
    this._settings.hideSpinner()
    if(entry.exists()) {
      this.selectedEntry = entry.data() as ProductEntry
      this.selectedEntry.id = id
      this.visibleView = true
    }
  }

  dismissView(event: any) {
    this.visibleView = false
    this.selectedEntry = null
  }

  deleteEntry(entry: ProductEntry) {

  }
}

import { Component, input, ViewChild } from '@angular/core';
import { Box } from '../../../core/models/box';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Timestamp } from '@firebase/firestore';
import { convertDatetimeToString } from '../../../core/core-util';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-box-table',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule
  ],
  templateUrl: './box-table.component.html',
  styles: ``
})
export class BoxTableComponent {
  @ViewChild('dt') dt!: Table;

  items = input.required<Box[]>()

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDatetimeToString(date)
  }

  getSeverityStatus(status: boolean) {
    if (status) {
      return 'success';
    } else {
      return 'secondary';
    }
  }

  getStatus(status: boolean) {
    if (status) {
      return 'Abierta';
    } else {
      return 'Cerrada';
    }
  }
}

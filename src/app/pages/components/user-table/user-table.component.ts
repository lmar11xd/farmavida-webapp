import { Component, input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { UserRolEnum } from '../../../core/enums/user-rol.enum';
import { User } from '../../../core/security/auth-service';

@Component({
  selector: 'app-user-table',
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
    InputTextModule, 
    FormsModule, 
    IconFieldModule, 
    InputIconModule
  ],
  templateUrl: './user-table.component.html',
  styles: ``
})
export class UserTableComponent {
  @ViewChild('dt') dt!: Table;
  
  items = input.required<User[]>()

  itemDialog: boolean = false;
  rolVendedor = UserRolEnum.VENDEDOR
  
  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) {}

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, 'global', 'contains');
  }

  deleteItem(item: User) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + item.names + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Deleted',
                life: 3000
            });
        }
    });
  }
}

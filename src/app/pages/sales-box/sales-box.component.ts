import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { BoxTableComponent } from "../components/box-table/box-table.component";
import { Box } from '../../core/models/box';
import { SettingsService } from '../../core/settings/settings.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { SalesBoxService } from './sales-box.service';
import { LISTAR_CAJAS } from '../../shared/breadcrumb/breadcrumb';
import { SaleService } from '../sales/sales.service';
import { Sale } from '../../core/models/sale';
import { convertDatetimeToString } from '../../core/core-util';
import { INITIAL_AMOUNT } from '../../core/constants/constants';

@Component({
  selector: 'app-sales-box',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ButtonModule, Dialog, BoxTableComponent],
  templateUrl: './sales-box.component.html',
  styles: ``
})
export default class SalesBoxComponent {
  boxes: Box[] = [];
  currentBox: Box | null = null;

  userId: string = '';
  username: string = '';

  visibleView: boolean = false;

  initialAmount: number = 0;
  cashAmount: number = 0;

  constructor(
    private _breadcrumService: BreadcrumbService,
    private _saleService: SaleService,
    private _salesBoxService: SalesBoxService,
    private _settings: SettingsService,
  ) {
    const user = this._settings.getUserInfo();
    this.userId = user?.id || '';
    this.username = user?.username || '';
    this.initialAmount = INITIAL_AMOUNT;
  }

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initializeBox();
    this.initialize()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs(LISTAR_CAJAS);
  }

  async initialize() {
    this._settings.showSpinner()

    this._salesBoxService.getBoxes(this.userId).subscribe({
      next: (data) => {
        this.boxes = data;
        this._settings.hideSpinner();
      },
      error: (error) => {
        console.error('Error', error);
        this._settings.hideSpinner();
      }
    });
  }

  initializeBox() {
    this._settings.showSpinner();
    this._salesBoxService.getOpenBox(this.userId)
      .then((boxDoc) => {
        if (boxDoc) {
          const boxId = boxDoc.id;
          this.currentBox = boxDoc.data() as Box;
          this.currentBox.id = boxId; // Asignar el ID de la caja
          console.log('Caja abierta encontrada:', this.currentBox);
        } else {
          this.currentBox = null;
          console.log('No hay caja abierta para este usuario');
        }
        this._settings.hideSpinner();
      }).catch(error => {
        this._settings.hideSpinner();
        console.error('Error al obtener caja abierta:', error);
      });
  }

  getFormatDate(date: Timestamp | Date | null | undefined) {
    return convertDatetimeToString(date)
  }

  showViewBox() {
    this.visibleView = true;
  }

  async showOpenBox() {
    if (!this.currentBox) {
      console.error('La caja no ha sido abierta');
      return;
    }

    this._settings.showSpinner();
    const boxId = this.currentBox.id || '';

    // Verificar si la caja del servidor ya está cerrada
    const serverBox = await this._salesBoxService.getBoxById(boxId);
    if(serverBox && !serverBox.isOpen) {
      console.error('La caja ya está cerrada');
      this._settings.showMessage('warn', 'Caja cerrada', 'La caja ya ha sido cerrada.');
      return;
    }

    console.log('Resumen de la caja actual:', this.currentBox);

    const { total, count } = await this.getTotalSales(boxId);
    const date = new Date();

    this.currentBox.closingDate = date;
    this.currentBox.systemAmount = total;
    this.currentBox.sales = count;
    this.currentBox.isOpen = false;
    this.currentBox.updatedAt = date;
    this.currentBox.updatedBy = this.username;

    this.visibleView = true; // Mostrar el modal de resumen

    this._settings.hideSpinner();
  }

  dismissViewBox() {
    this.visibleView = false
  }

  async onOpenBox() {
    if(this.initialAmount <= 0) {
      this._settings.showMessage('warn', 'Monto inicial inválido', 'El monto inicial debe ser mayor a cero.');
      return;
    }

    this._settings.showSpinner();
    const boxDoc = await this._salesBoxService.getOpenBox(this.userId);

    if (boxDoc) {
      console.error('La caja ya está abierta');
      this._settings.showMessage('warn', 'Caja abierta', 'Ya tienes una caja abierta.');
      this._settings.hideSpinner();
      return;
    }

    console.log('Abriendo caja para el usuario:', this.username);

    const date = new Date();
    const newBox: Box = {
      sellerId: this.userId,
      openingDate: date,
      closingDate: null,
      initialAmount: this.initialAmount,
      systemAmount: 0,
      cashAmount: 0,
      difference: 0,
      sales: 0,
      isOpen: true,
      createdAt: date,
      createdBy: this.username
    };

    this._salesBoxService.openBox(newBox)
      .then((data) => {
        console.log('Caja abierta exitosamente');
        this.currentBox = newBox; // Asignar la caja abierta actual
        this.currentBox.id = data.id; // Asignar el ID de la caja recién creada
        this.dismissViewBox();
        this._settings.hideSpinner();
        this._settings.showMessage('success', 'Caja abierta', 'La caja ha sido abierta exitosamente.');
      }).catch(error => {
        console.error('Error al abrir caja:', error);
        this._settings.hideSpinner();
      });
  }

  onCloseBox() {
    if(!this.currentBox) {
      console.error('No hay caja abierta para cerrar');
      return;
    }

    if(this.cashAmount <= 0) {
      this._settings.showMessage('warn', 'Monto de efectivo inválido', 'El monto de efectivo debe ser mayor a cero.');
      return;
    }

    const boxId = this.currentBox?.id || '';

    const box: Partial<Box> = {
      closingDate: this.currentBox.closingDate,
      systemAmount: this.currentBox.systemAmount,
      cashAmount: this.cashAmount,
      sales: this.currentBox.sales,
      isOpen: this.currentBox.isOpen,
      updatedAt: this.currentBox.updatedAt,
      updatedBy: this.currentBox.createdBy,
    };

    // Mostrar resumen de la caja antes de cerrar en un modal
    console.log('Resumen de la caja:', {
      openingDate: box.openingDate,
      closingDate: box.closingDate,
      initialAmount: this.currentBox.initialAmount,
      systemAmount: box.systemAmount,
      cashAmount: box.cashAmount,
      salesCount: box.sales,
    });

    this._settings.showSpinner();
    this._salesBoxService.closeBox(boxId, box)
      .then(() => {
        this._settings.hideSpinner();
        console.log('Caja cerrada exitosamente');
        this._settings.showMessage('success', 'Caja cerrada', 'La caja ha sido cerrada exitosamente.');
        this.dismissViewBox();
        this.currentBox = null; // Limpiar la caja actual
      }).catch(error => {
        this._settings.hideSpinner();
        console.error('Error al cerrar caja:', error);
      });
  }

  async getTotalSales(boxId: string) {
    const salesSnapshot = await this._saleService.getSalesByBoxId(boxId);
    let totalAmount = 0;
    let countSales = 0;

    salesSnapshot.forEach(doc => {
      const sale = doc.data() as Sale;
      totalAmount += sale.total || 0; // Sumar el total de cada venta
      countSales++; // Contar las ventas
    });

    return { total: totalAmount, count: countSales };
  }
}

import { Component } from '@angular/core';
import { BoxTableComponent } from "../components/box-table/box-table.component";
import { Box } from '../../core/models/box';
import { SettingsService } from '../../core/settings/settings.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { SalesBoxService } from './sales-box.service';
import { LISTAR_CAJAS } from '../../shared/breadcrumb/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { User } from '../../core/models/user';
import { SaleService } from '../sales/sales.service';
import { Sale } from '../../core/models/sale';

@Component({
  selector: 'app-sales-box',
  imports: [ButtonModule, BoxTableComponent],
  templateUrl: './sales-box.component.html',
  styles: ``
})
export default class SalesBoxComponent {
  boxes: Box[] = [];
  montoInicial: number = 0;
  currentBox?: Box | null = null;
  user: User | null = null;

  constructor(
    private _breadcrumService: BreadcrumbService,
    private _saleService: SaleService,
    private _salesBoxService: SalesBoxService,
    private _settings: SettingsService,
  ) {
    this.user = this._settings.getUserInfo();
  }

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initializeBox();
    this.initialize()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs(LISTAR_CAJAS);
  }

  initialize() {
    this._settings.showSpinner()

    this._salesBoxService.getBoxes(this.user?.id || '').subscribe({
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
    this._salesBoxService.getOpenBox(this.user?.id || '')
      .then((data) => {
        this._settings.hideSpinner();
        if (data.size > 0) {
          const boxId = data.docs[0].id;
          this.currentBox = data.docs[0].data() as Box;
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

  async onOpenBox() {
    if (!this.user) {
      console.error('Información del usuario no encontrada');
      return;
    }

    this._settings.showSpinner();
    const boxSnapshot = await this._salesBoxService.getOpenBox(this.user.id || '');

    if (boxSnapshot && boxSnapshot.size > 0) {
      console.error('La caja ya está abierta');
      this._settings.showMessage('warn', 'Caja abierta', 'Ya tienes una caja abierta.');
      this._settings.hideSpinner();
      return;
    }

    console.log('Abriendo caja para el usuario:', this.user);

    const date = new Date();
    const newBox: Box = {
      sellerId: this.user.id || '',
      openingDate: date,
      closingDate: null,
      initialAmount: 0,
      finalAmount: 0,
      sales: 0,
      isOpen: true,
      createdAt: date,
      createdBy: this.user.username
    };

    this._salesBoxService.openBox(newBox)
      .then((data) => {
        this._settings.hideSpinner();
        console.log('Caja abierta exitosamente');
        this._settings.showMessage('success', 'Caja abierta', 'La caja ha sido abierta exitosamente.');
        this.currentBox = newBox; // Asignar la caja abierta actual
        this.currentBox.id = data.id; // Asignar el ID de la caja recién creada
      }).catch(error => {
        this._settings.hideSpinner();
        console.error('Error al abrir caja:', error);
      });
  }

  async onCloseBox() {
    if (!this.user) {
      console.error('Información del usuario no encontrada');
      return;
    }

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

    console.log('Cerrando caja:', this.currentBox);

    const { total, count } = await this.getTotalSales(boxId);
    const date = new Date();
    const box: Partial<Box> = {
      closingDate: date,
      finalAmount: total,
      sales: count,
      isOpen: false,
      updatedAt: date,
      updatedBy: this.user?.username,
    };

    // Mostrar resumen de la caja antes de cerrar en un modal
    console.log('Resumen de la caja:', {
      initialAmount: this.currentBox.initialAmount,
      finalAmount: box.finalAmount,
      salesCount: box.sales,
      closingDate: box.closingDate,
    });

    this._salesBoxService.closeBox(boxId, box)
      .then(() => {
        this._settings.hideSpinner();
        console.log('Caja cerrada exitosamente');
        this._settings.showMessage('success', 'Caja cerrada', 'La caja ha sido cerrada exitosamente.');
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

import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { ExcelService } from '../../shared/services/excel.service';
import { SettingsService } from '../../core/settings/settings.service';
import { BreadcrumbService } from '../../shared/services/breadcrumb.service';
import { ProductEntry } from '../../core/models/product-entry';
import { ProductEntryTableComponent } from '../components/product-entry-table/product-entry-table.component';
import { ProductEntryService } from './product-entry.service';
import { LISTAR_INGRESO_PRODUCTO } from '../../shared/breadcrumb/breadcrumb';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product } from '../../core/models/product';
import { StatusEntryEnum } from '../../core/enums/status-entry.enum';
import { MSG_ENTRY_EXISTS } from '../../core/constants/constants';

@Component({
  selector: 'app-product-entry',
  providers: [ConfirmationService],
  imports: [ButtonModule, FileUpload, ConfirmDialogModule, ProductEntryTableComponent],
  templateUrl: './product-entry.component.html',
  styles: ``
})
export default class ProductEntryComponent {
  entries: ProductEntry[] = []

  constructor(
    private _settings: SettingsService,
    private _confirmationService: ConfirmationService,
    private _breadcrumService: BreadcrumbService,
    private _productEntryService: ProductEntryService,
    private _excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initialize()
  }

  initializeBreadcrumb() {
    this._breadcrumService.addBreadcrumbs(LISTAR_INGRESO_PRODUCTO);
  }

  initialize() {
    this._settings.showSpinner()
    this._productEntryService.getEntries()
      .subscribe({
        next: (data) => {
          this.entries = data;
          this._settings.hideSpinner();
        },
        error: (error) => {
          console.error('Error al obtener datos', error);
          this._settings.hideSpinner();
        }
      });
  }

  async readExcelProducts(event: any) {
    try {
      this._settings.showSpinner()
      const file = event.files[0];

      if(file == null) {
        this._settings.showMessage('warn', 'Alerta', 'No se ha seleccionado ningun archivo')
        return;
      }

      const entrySnapshot = await this._productEntryService.getEntryByName(file.name)
      if(entrySnapshot.empty){
        const products = await this._excelService.readExcelProducts(file)
        if(products != null && products.length > 0) {
          this.showDialogSaveProducts(file.name, products)
        }
      } else {
        this._settings.showMessage('warn', 'Alerta', MSG_ENTRY_EXISTS)
      }
    } catch (error) {
      console.log(error)
      this._settings.showMessage('error', 'Error', 'Error al leer el archivo ' + error)
    } finally {
      this._settings.hideSpinner()
    }
  }

  showDialogSaveProducts(fileName: string, products: Product[]) {
    this._confirmationService.confirm({
      message: 'Los productos se han cargado, ¿Deseas guardarlos?',
      header: 'Guardar Productos',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
          label: 'Guardar',
      },
      accept: () => {
        const productEntry: ProductEntry = {
          products: products,
          fileName: fileName,
          entryDate: new Date(),
          status: StatusEntryEnum.UNPROCESSED,
          username: this._settings.getUserInfo()?.username || 'admin'
        }

        this._productEntryService.create(productEntry)
          .then(() => {
            this._settings.showMessage('success', 'Guardar', 'Ingreso de productos guardado correctamente')
          })
          .catch(error => {
            console.log(error)
            this._settings.showMessage('error', 'Error', 'Error al guardar ingreso de productos')
          })
      },
      reject: () => {
        console.log("Cancelar productos")
      }
    });
  }
}


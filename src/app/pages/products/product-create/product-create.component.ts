import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { Timestamp } from '@angular/fire/firestore';
import { FieldsetModule } from 'primeng/fieldset';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ProductCreate, ProductService } from '../product.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { CREAR_PRODUCTO, LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-product-create',
  imports: [
    ReactiveFormsModule,
    FieldsetModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    DatePickerModule
  ],
  templateUrl: './product-create.component.html',
  styles: ``
})
export default class ProductCreateComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isLoading = signal(false)

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _router: Router,
    private _settings: SettingsService,
    private _breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initializeForm()
  }

  initializeBreadcrumb() {
    let BREADCRUMBS: MenuItem[] = [...LISTAR_PRODUCTO, ...CREAR_PRODUCTO];

    this._breadcrumbService.addBreadcrumbs(BREADCRUMBS);
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      name: this._formBuilder.control('', Validators.required),
      description: this._formBuilder.control('', []),
      expirationDate: this._formBuilder.control(null, []),
      quantity: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
      costPrice: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
      salePrice: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
      um: this._formBuilder.control('', []),
      lot: this._formBuilder.control('', []),
      laboratory: this._formBuilder.control('', []),
      sanitaryReg: this._formBuilder.control('', []),
    })
  }

  async onSubmit() {
    if(this.form.invalid) return

    try {
      this.isLoading.set(true)
      this._settings.showSpinner()

      const { name, description, expirationDate, quantity, costPrice, salePrice, um, lot, laboratory, sanitaryReg } = this.form.value

      const product: ProductCreate = ({
        code: '',
        name: name || '',
        description: description || '',
        expirationDate: Timestamp.fromDate(expirationDate) || null,
        quantity: quantity || 0,
        costPrice: costPrice || 0,
        salePrice: salePrice || 0,
        um: um || '',
        lot: lot || '',
        laboratory: laboratory || '',
        sanitaryReg: sanitaryReg || '',
        createdAt: new Date(),
        createdBy: this._settings.getUserInfo()?.username || 'admin',
      })

      await this._productService.create(product)
      this._settings.showMessage('success', 'Guardar', 'Producto creado correctamente');
      this._router.navigateByUrl('/product/list')
    } catch (error) {
      console.error(error)
      this._settings.showMessage('error', 'Error', 'Error al crear producto');
    } finally {
      this.isLoading.set(false)
      this._settings.hideSpinner()
    }
  }
}

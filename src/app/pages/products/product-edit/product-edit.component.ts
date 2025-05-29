import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Timestamp } from '@angular/fire/firestore';
import { ProductCreate, ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../../core/settings/settings.service';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { EDITAR_PRODUCTO, LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-edit',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    FieldsetModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    DatePickerModule
  ],
  templateUrl: './product-edit.component.html',
  styles: ``
})
export default class ProductEditComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  id: string | null = null

  constructor(
    private _formBuilder: FormBuilder,
    private _productService: ProductService,
    private _router: Router,
    private _settings: SettingsService,
    private _breadcrumbService: BreadcrumbService,
    private _route: ActivatedRoute,
  ) {
    this._route.queryParamMap.subscribe(params => {
      this.id = params.get('pkey');
    });
  }

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initializeForm()
    this.initialize()
  }

  initializeBreadcrumb() {
    if(this.id != null) {
      EDITAR_PRODUCTO[0]?.url && (EDITAR_PRODUCTO[0].url = EDITAR_PRODUCTO[0].url.replace(':id', this.id));

      let BREADCRUMBS: MenuItem[] = [...LISTAR_PRODUCTO, ...EDITAR_PRODUCTO];

      this._breadcrumbService.addBreadcrumbs(BREADCRUMBS);
    }
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      code: this._formBuilder.control({ value: '', disabled: true }, Validators.required),
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

  initialize() {
    if(this.id != null) {
      this.getProduct(this.id)
    }
  }

  async getProduct(id: string) {
    this._settings.showSpinner()
    const productSnapshot = await this._productService.getProduct(id)
    this._settings.hideSpinner()
    if(!productSnapshot.exists()) return
    const product = productSnapshot.data() as Product
    product.expirationDate = product.expirationDate ? (product.expirationDate as Timestamp).toDate() : null
    this.form.patchValue(product)
  }

  async onSubmit() {
   if(this.form.invalid) return

    try {
      if(this.id != null) {
        this._settings.showSpinner()

        const { code, name, description, expirationDate, quantity, costPrice, salePrice, um, lot, laboratory, sanitaryReg } = this.form.getRawValue()

        const expirationDateValue = expirationDate ? Timestamp.fromDate(expirationDate) : null;

        const product: ProductCreate = ({
          code: code || '',
          name: name || '',
          description: description || '',
          expirationDate: expirationDateValue,
          quantity: quantity || 0,
          costPrice: costPrice || 0,
          salePrice: salePrice || 0,
          um: um || '',
          lot: lot || '',
          laboratory: laboratory || '',
          sanitaryReg: sanitaryReg || '',
          updatedAt: new Date(),
          updatedBy: this._settings.getUserInfo()?.username || 'admin',
        })

        await this._productService.update(this.id, product)
        this._settings.showMessage('success', 'Guardar', 'Producto actualizado correctamente')
        this._router.navigateByUrl('/product/list')
      }
    } catch (error) {
      console.error('Error al rditar producto:', error);
      this._settings.showMessage('error', 'Error', 'Error al actualizar producto')
    } finally {
      this._settings.hideSpinner()
    }
  }

}

import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { Timestamp } from '@angular/fire/firestore';
import { FieldsetModule } from 'primeng/fieldset';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
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
    private _breadcrumbService: BreadcrumbService,
    private _messageService: MessageService,
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
      salePrice: this._formBuilder.control(0, [Validators.required, Validators.min(1)])
    })
  }

  async onSubmit() {
    if(this.form.invalid) return
    
    try {
      this.isLoading.set(true)
      this._settings.showSpinner()
      const { code, name, description, expirationDate, quantity, costPrice, salePrice } = this.form.value

      const product: ProductCreate = ({
        code: code || '',
        name: name || '',
        description: description || '',
        expirationDate: Timestamp.fromDate(expirationDate) || null,
        quantity: quantity || 0,
        costPrice: costPrice || 0,
        salePrice: salePrice || 0
      })

      await this._productService.create(product)
      this._messageService.add({
        severity: 'success',
        summary: 'Guardar',
        detail: 'Producto creado correctamente',
        life: 3000
      });
      this._router.navigateByUrl('/product/list')
    } catch (error) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al crear producto',
        life: 3000
      });
    } finally {
      this.isLoading.set(false)
      this._settings.hideSpinner()
    }
  }
}

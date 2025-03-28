import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { FormsModule } from '@angular/forms';
import { ProductCreate, ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../../core/settings/settings.service';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { EDITAR_PRODUCTO, LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../../core/models/product';
import { Timestamp } from '@angular/fire/firestore';

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
  isLoading = signal(false)
  id: string | null = null

  constructor(
    private _formBuilder: FormBuilder, 
    private _productService: ProductService, 
    private _router: Router,
    private _settings: SettingsService,
    private _breadcrumbService: BreadcrumbService,
    private _route: ActivatedRoute,
    private _messageService: MessageService,
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
      salePrice: this._formBuilder.control(0, [Validators.required, Validators.min(1)])
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
        this.isLoading.set(true)
        this._settings.showSpinner()
        
        const { code, name, description, expirationDate, quantity, costPrice, salePrice } = this.form.getRawValue()
        
        const product: ProductCreate = ({
          code: code || '',
          name: name || '',
          description: description || '',
          expirationDate: Timestamp.fromDate(expirationDate) || null,
          quantity: quantity || 0,
          costPrice: costPrice || 0,
          salePrice: salePrice || 0
        })
  
        await this._productService.update(product, this.id)
        this._messageService.add({
          severity: 'success',
          summary: 'Guardar',
          detail: 'Producto actualizado correctamente',
          life: 3000
        });
        this._router.navigateByUrl('/product/list')
      }
    } catch (error) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar producto',
        life: 3000
      });
    } finally {
      this.isLoading.set(false)
      this._settings.hideSpinner()
    }
  }

}

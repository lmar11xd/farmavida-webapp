import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { ProductCreate, ProductService } from '../product.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { CREAR_PRODUCTO, LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, FieldsetModule, ButtonModule],
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
      code: this._formBuilder.control('', Validators.required),
      name: this._formBuilder.control('', Validators.required),
      description: this._formBuilder.control('', []),
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
      const { code, name, description, quantity, costPrice, salePrice } = this.form.value

      const product: ProductCreate = ({
        code: code || '',
        name: name || '',
        description: description || '',
        quantity: quantity || 0,
        costPrice: costPrice || 0,
        salePrice: salePrice || 0
      })

      await this._productService.create(product)
      toast.success("Producto creado correctamente")
      this._router.navigateByUrl('/product/list')
    } catch (error) {
      toast.error("Error al guardar producto")
    } finally {
      this.isLoading.set(false)
      this._settings.hideSpinner()
    }
  }
}

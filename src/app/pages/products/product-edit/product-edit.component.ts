import { Component, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductCreate, ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { toast } from 'ngx-sonner';
import { SettingsService } from '../../../core/settings/settings.service';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { EDITAR_PRODUCTO, LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, ButtonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export default class ProductEditComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  isLoading = signal(false)
  id = input.required<string>()

  constructor(
    private _formBuilder: FormBuilder, 
    private _productService: ProductService, 
    private _router: Router,
    private _settings: SettingsService,
    private _breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initializeForm()
    this.initialize()
  }

  initializeBreadcrumb() {
    const id = this.id()
    EDITAR_PRODUCTO[0]?.url && (EDITAR_PRODUCTO[0].url = EDITAR_PRODUCTO[0].url.replace(':id', id));

    let BREADCRUMBS: MenuItem[] = [...LISTAR_PRODUCTO, ...EDITAR_PRODUCTO];

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

  initialize() {
    const id = this.id()
    if(id) {
      this.getProduct(id)
    }
  }

  async getProduct(id: string) {
    this._settings.showSpinner()
    const productSnapshot = await this._productService.getProduct(id)
    this._settings.hideSpinner()
    if(!productSnapshot.exists()) return
    const product = productSnapshot.data() as Product
    this.form.patchValue(product)
  }

  async onSubmit() {
   if(this.form.invalid) return
       
    try {
      const id = this.id()
      if(id) {
        this._settings.showSpinner()
        this.isLoading.set(true)
        const { code, name, description, quantity, costPrice, salePrice } = this.form.value
  
        const product: ProductCreate = ({
          code: code || '',
          name: name || '',
          description: description || '',
          quantity: quantity || 0,
          costPrice: costPrice || 0,
          salePrice: salePrice || 0
        })
  
        await this._productService.update(product, id)
        toast.success("Producto actualizado correctamente")
        this._router.navigateByUrl('/product/list')
      }
    } catch (error) {
      toast.error("Error al actualizar producto")
    } finally {
      this.isLoading.set(false)
      this._settings.hideSpinner()
    }
  }

}

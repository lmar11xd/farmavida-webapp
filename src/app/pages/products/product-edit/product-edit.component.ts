import { Component, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductCreate, ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { toast } from 'ngx-sonner';
import { SettingsService } from '../../../core/settings/settings.service';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { EDITAR_PRODUCTO, LISTAR_PRODUCTO } from '../../../shared/breadcrumb/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, FieldsetModule, ButtonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
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
    private _route: ActivatedRoute
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
      code: this._formBuilder.control('', Validators.required),
      name: this._formBuilder.control('', Validators.required),
      description: this._formBuilder.control('', []),
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
    this.form.patchValue(product)
  }

  async onSubmit() {
   if(this.form.invalid) return
       
    try {
      if(this.id != null) {
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
  
        await this._productService.update(product, this.id)
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

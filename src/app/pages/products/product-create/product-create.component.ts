import { Component, signal } from '@angular/core';
import { CopyrightComponent } from "../../../shared/ui/copyright.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProductCreate, ProductService } from '../product.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, ButtonModule, CopyrightComponent],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export default class ProductCreateComponent {
  form: FormGroup
  isLoading = signal(false)
  
  constructor(private _formBuilder: FormBuilder, private _productService: ProductService, private _router: Router) {
    this.form = _formBuilder.group({
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
    }
  }
}

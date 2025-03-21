import { Component, effect, input } from '@angular/core';
import { Product } from '../../products/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-table',
  imports: [RouterLink],
  templateUrl: './product-table.component.html',
  styles: ``
})
export class ProductTableComponent {
  products = input.required<Product[]>()
  constructor() {
    effect(() => {
      console.log(this.products())
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router';
import { Product, ProductService } from '../product.service';
import { ProductTableComponent } from '../../components/product-table/product-table.component';

@Component({
  selector: 'app-product-list',
  imports: [ButtonModule, RouterLink, ProductTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export default class ProductListComponent implements OnInit {
  products: Product[] = []
  isLoading: boolean = true;

  constructor(private _productService: ProductService) {}

  ngOnInit(): void {
    //this.products = this._productService.getProducts()
    this._productService.getCollection<Product>('products')
    .subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener datos', error);
        this.isLoading = false;
      },
      complete: () => {
        console.log('Carga completa de productos');
      }
    });
  }
}

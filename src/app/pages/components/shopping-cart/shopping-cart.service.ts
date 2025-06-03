import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product } from "../../../core/models/product";

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
    private cart: Product[] = [];
    private cartSubject = new BehaviorSubject<Product[]>([]);

    cart$ = this.cartSubject.asObservable();

    add(producto: Product) {
        const item = this.cart.find(p => p.id === producto.id);
        if (item) {
            item.quantity += 1;
        } else {
            this.cart.push({ ...producto, quantity: 1 });
        }
        
        this.cartSubject.next([...this.cart]);
    }

    deleteProduct(id: string) {
        this.cart = this.cart.filter(p => p.id !== id);
        this.cartSubject.next([...this.cart]);
    }

    clean() {
        this.cart = [];
        this.cartSubject.next([]);
    }

    get(): Product[] {
        return this.cart;
    }

    getTotal(): number {
        return this.cart.reduce((total, product) => {
            return total + product.salePrice * product.quantity;
        }, 0);
    }
}
  
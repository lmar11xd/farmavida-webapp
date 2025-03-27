import { Injectable, signal } from '@angular/core';
import { CollectionReference, Firestore, collection, addDoc, collectionData, doc, getDoc, updateDoc, query, where, increment } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product';

export type ProductCreate = Omit<Product, 'id'>

const PATH = 'products'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _collection: CollectionReference

  isLoading = signal<boolean>(true)

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  getCollection<T>(path: string): Observable<T[]> {
    const colRef = collection(this._firestore, path);
    return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
  }

  getCollectionByFilter<Product>(): Observable<Product[]> {
    const _query = query(
      this._collection,
      where('code', '==', "")
    )

    return collectionData(_query, { idField: 'id' }) as Observable<Product[]>; 
  }

  getProduct(id: string) {
    const doRef = doc(this._collection, id)
    return getDoc(doRef)
  }

  create(product: ProductCreate) {
    return addDoc(this._collection, product)
  }

  update(product: ProductCreate, id: string) {
    const doRef = doc(this._collection, id)
    return updateDoc(doRef, product)
  }

  async updateStock(productId: string, quantitySold: number) {
    console.log("Actualizar stock del producto: " + productId + " cantidad vendida: " + quantitySold)
    const productRef = doc(this._firestore, `${PATH}/${productId}`);
    
    // Verificar stock antes de restar
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const currentStock = (productSnap.data() as Product).quantity;
      console.log("Stock actual: " + currentStock)

      if (currentStock >= quantitySold) {
        // Restar cantidad vendida usando increment()
        await updateDoc(productRef, {
          quantity: increment(-quantitySold)
        });
      } else {
        throw new Error('Stock insuficiente.');
      }
    } else {
      throw new Error('Producto no encontrado.');
    }
  }

}

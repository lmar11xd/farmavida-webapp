import { Injectable, signal } from '@angular/core';
import { CollectionReference, Firestore, collection, addDoc, collectionData, doc, getDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
    id: string,
    code: string,
    name: string,
    description: string,
    quantity: string,
    costPrice: number,
    salePrice: number
}

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
}

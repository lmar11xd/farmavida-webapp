import { Injectable, signal } from '@angular/core';
import { CollectionReference, Firestore, collection, addDoc, collectionData, doc, getDoc, updateDoc, query, where, increment, runTransaction, Timestamp } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Product } from '../../core/models/product';
import { INITIAL_PRODUCT_CODE } from '../../core/constants/constants';

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

  getProducts(): Observable<Product[]> {
    return collectionData(this._collection, { idField: 'id' }).pipe(
      map(products => 
        products.map(product => ({
          ...product,
          expirationDate: product['expirationDate'] ? (product['expirationDate'] as Timestamp).toDate() : null
        }) as Product)
      )
    ) as Observable<Product[]>;
  }

  getProduct(id: string) {
    const doRef = doc(this._collection, id)
    return getDoc(doRef)
  }

  async create(product: ProductCreate) {
    const code = await this.generateProductCode();
    const newProduct = { ...product, code }
    return addDoc(this._collection, newProduct)
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

  async generateProductCode(): Promise<string> {
    const secuenciaRef = doc(this._firestore, 'config/product');

    return await runTransaction(this._firestore, async (transaction) => {
      const secuenciaDoc = await transaction.get(secuenciaRef);

      let newCode = INITIAL_PRODUCT_CODE; // Valor inicial si el documento no existe

      if (secuenciaDoc.exists()) {
        const data = secuenciaDoc.data();
        newCode = (data['code'] || INITIAL_PRODUCT_CODE) + 1;
      }

      // Actualizar el código en Firestore
      transaction.set(secuenciaRef, { code: newCode });

      return newCode.toString();
    });
  }

}

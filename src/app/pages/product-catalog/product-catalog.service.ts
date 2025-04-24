import { Injectable } from "@angular/core";
import { CollectionReference, Firestore, collection, collectionData, addDoc } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Product } from "../../core/models/product";

const PATH = 'products'

@Injectable({
  providedIn: 'root'
})
export class ProductCatalogService {
    private _collection: CollectionReference

    constructor(
      private _firestore: Firestore
    ) {
      this._collection = collection(this._firestore, PATH)
    }

    getProducts(): Observable<Product[]> {
      return collectionData(this._collection, { idField: 'id' }) as Observable<Product[]>;
    }

  }

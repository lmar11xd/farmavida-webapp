import { Injectable } from "@angular/core";
import { ProductEntry } from "../../core/models/product-entry";
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from "@angular/fire/firestore";
import { map, Observable } from "rxjs";
import { MSG_ENTRY_EXISTS } from '../../core/constants/constants';

export type ProductEntryCreate = Omit<ProductEntry, 'id'>

const PATH = 'product-entries'

@Injectable({providedIn: 'root'})
export class ProductEntryService {
  private _collection: CollectionReference

  constructor(private _firestore: Firestore) {
      this._collection = collection(this._firestore, PATH)
  }

  getEntries(): Observable<ProductEntry[]> {
    const orderedQuery = query(
      this._collection,
      orderBy('entryDate', 'desc'),    // primero por fecha descendente
      orderBy('fileName', 'asc')      // luego por nombre ascendente
    )

    return collectionData(orderedQuery, { idField: 'id' }) as Observable<ProductEntry[]>;
  }

  getEntry(id: string) {
    const doRef = doc(this._collection, id)
    return getDoc(doRef)
  }

  async create(productEntry: ProductEntryCreate) {
     const q = query(this._collection, where('fileName', '==', productEntry.fileName));

     const fileNameSnapshot = await getDocs(q);

     if (!fileNameSnapshot.empty) {
       throw new Error(MSG_ENTRY_EXISTS);
     }

    return addDoc(this._collection, productEntry)
  }

  update(id: string, productEntry: Partial<ProductEntry>) {
    const entryRef = doc(this._collection, id);
    return updateDoc(entryRef, { ...productEntry });
  }

  async getEntryByName(name: string) {
    const q = query(this._collection, where('fileName', '==', name));

    const entrySnapshot = await getDocs(q);

    return entrySnapshot;
  }
}

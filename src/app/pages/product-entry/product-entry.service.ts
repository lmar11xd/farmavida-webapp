import { Injectable } from "@angular/core";
import { ProductEntry } from "../../core/models/product-entry";
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, Timestamp } from "@angular/fire/firestore";
import { map, Observable } from "rxjs";

export type ProductEntryCreate = Omit<ProductEntry, 'id'>

const PATH = 'product-entries'

@Injectable({providedIn: 'root'})
export class ProductEntryService {
    private _collection: CollectionReference

    constructor(private _firestore: Firestore) {
        this._collection = collection(this._firestore, PATH)
    }

    getEntries(): Observable<ProductEntry[]> {
      return collectionData(this._collection, { idField: 'id' }).pipe(
        map(entries =>
            entries.map(({ products, ...entry }) => ({
                ...entry,
                entryDate: entry['entryDate'] ? (entry['entryDate'] as Timestamp).toDate() : null,
                processingDate: entry['processingDate'] ? (entry['processingDate'] as Timestamp).toDate() : null
            }) as ProductEntry)
        )
      ) as Observable<ProductEntry[]>;
    }

    getEntry(id: string) {
      const doRef = doc(this._collection, id)
      return getDoc(doRef)
    }

    async create(productEntry: ProductEntryCreate) {
        return addDoc(this._collection, productEntry)
    }
}

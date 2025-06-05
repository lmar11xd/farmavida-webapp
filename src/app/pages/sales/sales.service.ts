import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentReference, Firestore, getDoc, getDocs, orderBy, query, runTransaction, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sale } from '../../core/models/sale';
import { PREFIX_SALE } from './../../core/constants/constants';

const PATH = 'sales'

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private _collection: CollectionReference

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  getSales(username: string): Observable<Sale[]> {
    let orderedQuery;
    if(username === 'ALL') {
      orderedQuery = query(this._collection, orderBy('saleDate', 'desc'));
    } else {
      orderedQuery = query(this._collection, where('createdBy', '==', username), orderBy('saleDate', 'desc'));
    }

    return collectionData(orderedQuery, { idField: 'id' }) as Observable<Sale[]>;
  }

  async create(sale: Sale) {
    let code = await this.generateSaleCode();
    const newSale = { ...sale, code };
    await addDoc(this._collection, newSale)
    return {sale: newSale, code};
  }

  async generateSaleCode(): Promise<string> {
    const secuenciaRef = doc(this._firestore, 'config/sale');

    return await runTransaction(this._firestore, async (transaction) => {
      const secuenciaDoc = await transaction.get(secuenciaRef);

      let newCode = 0; // Valor inicial si el documento no existe

      if (secuenciaDoc.exists()) {
        const data = secuenciaDoc.data();
        newCode = (data['code'] || 0) + 1;
      }

      // Actualizar el código en Firestore
      transaction.set(secuenciaRef, { code: newCode });

      const newCodeString = PREFIX_SALE + '-' + newCode.toString().padStart(6, '0'); // Asegurarse de que el código tenga 6 dígitos
      return newCodeString;
    });
  }

  getSalesByBoxId(boxId: string) {
    const q = query(
      this._collection,
      where('boxId', '==', boxId)
    );

    return getDocs(q)
  }

  getNewSaleRef(): DocumentReference<Sale> {
    return doc(this._collection) as DocumentReference<Sale>; // genera una ref vacía con ID automático
  }

  async getByRef(ref: DocumentReference<Sale>): Promise<Sale> {
    const snap = await getDoc(ref);
    return snap.data() as Sale;
  }
}

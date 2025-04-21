import { PREFIX_SALE_TICKET } from './../../core/constants/constants';
import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, orderBy, query, runTransaction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sale } from '../../core/models/sale';

const PATH = 'sales'

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private _collection: CollectionReference

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  getSales(): Observable<Sale[]> {
    const orderedQuery = query(this._collection, orderBy('saleDate', 'desc'));

    return collectionData(orderedQuery, { idField: 'id' }) as Observable<Sale[]>;
  }

  async create(sale: Sale) {
    let code = await this.generateSaleCode();
    code = PREFIX_SALE_TICKET + '-' + code.padStart(6, '0'); // Asegurarse de que el código tenga 6 dígitos
    const newSale = { ...sale, code };
    return addDoc(this._collection, newSale);
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

      return newCode.toString();
    });
  }
}

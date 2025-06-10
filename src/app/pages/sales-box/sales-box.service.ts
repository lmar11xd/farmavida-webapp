import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, getDocs, limit, orderBy, query, runTransaction, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Box } from './../../core/models/box';
import { PREFIX_SALE_BOX } from '../../core/constants/constants';

const PATH = 'sales-box';

@Injectable({ providedIn: 'root' })
export class SalesBoxService {
  private _collection: CollectionReference

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  async generateSaleCode(): Promise<string> {
    const secuenciaRef = doc(this._firestore, 'config/box');

    return await runTransaction(this._firestore, async (transaction) => {
      const secuenciaDoc = await transaction.get(secuenciaRef);

      let newCode = 0; // Valor inicial si el documento no existe

      if (secuenciaDoc.exists()) {
        const data = secuenciaDoc.data();
        newCode = (data['code'] || 0) + 1;
      }

      // Actualizar el código en Firestore
      transaction.set(secuenciaRef, { code: newCode });

      const newCodeString = PREFIX_SALE_BOX + '-' + newCode.toString().padStart(6, '0'); // Asegurarse de que el código tenga 6 dígitos
      return newCodeString;
    });
  }

  async openBox(box: Box) {
    let code = await this.generateSaleCode();
    const newBox = { ...box, code };
    return await addDoc(this._collection, newBox);
  }

  closeBox(id: string, box: Partial<Box>) {
    const boxRef = doc(this._collection, id);
    return updateDoc(boxRef, { ...box });
  }

  async getOpenBox(sellerId: string) {
    const q = query(
      this._collection,
      where('sellerId', '==', sellerId),
      where('isOpen', '==', true),
      limit(1)
    );

    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0];
  }

  getBoxes(sellerId: string, isOpen: boolean) {
    const q = query(
      this._collection,
      where('sellerId', '==', sellerId),
      where('isOpen', '==', isOpen),
      orderBy('openingDate', 'desc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<Box[]>;
  }

  getBoxById(id: string) {
    const boxRef = doc(this._collection, id);
    return getDoc(boxRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Box;
        } else {
          throw new Error('Caja no encontrada');
        }
      }).catch(error => {
        console.error('Error al obtener caja:', error);
        throw error;
      });
  }

}

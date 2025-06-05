import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Box } from './../../core/models/box';

const PATH = 'sales-box';

@Injectable({ providedIn: 'root' })
export class SalesBoxService {
  private _collection: CollectionReference

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  openBox(box: Box) {
    return addDoc(this._collection, box);
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

  getBoxes(sellerId: string) {
    const q = query(
      this._collection,
      where('sellerId', '==', sellerId),
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

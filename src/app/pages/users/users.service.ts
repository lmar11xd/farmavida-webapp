import { Injectable } from "@angular/core";
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, query, updateDoc, where } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "../../core/models/user";

export type UserCreate = Omit<User, 'id'>

const PATH = 'users'

@Injectable({ providedIn: 'root' })
export class UserService {
  private _collection: CollectionReference

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  getUsers(): Observable<User[]> {
    return collectionData(this._collection, { idField: 'id' }) as Observable<User[]>;
  }

  getUser(id: string) {
    const doRef = doc(this._collection, id)
    return getDoc(doRef)
  }

  async createUser(user: User) {
    // Consulta para verificar si username o email ya existen
    const q = query(this._collection, where('username', '==', user.username));
    const q2 = query(this._collection, where('email', '==', user.email));

    const usernameSnapshot = await getDocs(q);
    const emailSnapshot = await getDocs(q2);

    if (!usernameSnapshot.empty) {
      throw new Error('El nombre de usuario ya está en uso.');
    }
    if (!emailSnapshot.empty) {
      throw new Error('El correo electrónico ya está en uso.');
    }

    return addDoc(this._collection, user);
  }

  updateUser(id: string, user: User) {
    const userRef = doc(this._collection, id);
    return updateDoc(userRef, { ...user });
  }

  async updatePartial(userId: string, names: string, phone: string) {
    const userRef = doc(this._firestore, `${PATH}/${userId}`);
    
    // Verificar stock antes de restar
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        names: names,
        phone: phone
      })
    } else {
      throw new Error('Usuario no encontrado.');
    }
  }

  deleteUser(id: string) {
    const userRef = doc(this._collection, id);
    return deleteDoc(userRef);
  }
  
}  
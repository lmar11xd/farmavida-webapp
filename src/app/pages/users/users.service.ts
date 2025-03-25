import { Injectable, signal } from "@angular/core";
import { UserRolEnum } from "../../core/enums/user-rol.enum";
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from "@angular/fire/firestore";
import { Observable } from "rxjs";

export interface User {
    id?: string;
    username: string;
    names: string;
    phone?: string;
    email: string;
    password: string;
    role: UserRolEnum;
}

export type UserCreate = Omit<User, 'id'>

const PATH = 'users'

@Injectable({ providedIn: 'root' })
export class UserService {
    private _collection: CollectionReference

  isLoading = signal<boolean>(true)

  constructor(private _firestore: Firestore) {
    this._collection = collection(this._firestore, PATH)
  }

  getUsers(): Observable<User[]> {
    return collectionData(this._collection, { idField: 'id' }) as Observable<User[]>;
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

  deleteUser(id: string) {
    const userRef = doc(this._collection, id);
    return deleteDoc(userRef);
  }
  
}  
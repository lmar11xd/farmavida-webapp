import { Injectable, signal } from "@angular/core";
import { UserRolEnum } from "../../core/enums/user-rol.enum";
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, updateDoc } from "@angular/fire/firestore";
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

  createUser(user: User) {
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
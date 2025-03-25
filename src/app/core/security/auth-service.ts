import { Injectable, NgZone } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { collection, Firestore, getDocs, query, where } from "@angular/fire/firestore";
import * as CryptoJS from 'crypto-js';
import { User } from "../../pages/users/users.service";
import { AES_SECRET_KEY, MSG_INVALID_CREDENTIALS } from "../constants/constants";
import { UserRolEnum } from "../enums/user-rol.enum";
import { resolve } from "path";

export interface UserLogin {
  username: string,
  email: string,
  password: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private _auth: Auth, private _fireStore: Firestore, private _ngZone: NgZone) {}

  signup(user: UserLogin) {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this._auth, 'user.email', user.password)
        .then((userCredential) => {
          this._ngZone.run(() => resolve(userCredential));
        })
        .catch((error) => reject(error));
      });
  }

  async login(userLogin: UserLogin) {
    const q = query(collection(this._fireStore, 'users'), where('username', '==', userLogin.username))
    const querySnapshot = await getDocs(q)

    if(querySnapshot.empty) {
      throw new Error(MSG_INVALID_CREDENTIALS);
    }

    const userData = querySnapshot.docs[0].data() as User
    if(userData.role == UserRolEnum.ADMINISTRADOR) {
      return this.loginAdmin(userData.email, userLogin.password)
    } else {
      return this.loginVendedor(userData)
    }
  }

  logout() {
    return new Promise((resolve, reject) => {
        signOut(this._auth)
          .then(() => {
              this._ngZone.run(() => resolve(true))
          })
          .catch((error) => reject(error))
      }
    );
  }

  loginAdmin(email: string, password: string) {
    console.log('Logearse como Administrador')
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this._auth, email, password)
        .then((userCredential) => {
          this._ngZone.run(() => resolve(userCredential));
        })
        .catch((error) =>  {
          const errorFirebase = error.toString()
          if(errorFirebase.includes('wrong-password') || errorFirebase.includes('user-not-found')) {
            reject(new Error(MSG_INVALID_CREDENTIALS))
          }
          reject(error)
        });
      }
    );
  }

  loginVendedor(user: User) {
    console.log('Logearse como Vendedor')
    return new Promise((resolve, reject) => {
      const hashedPassword = CryptoJS.AES.decrypt(user.password, AES_SECRET_KEY).toString()
      if(hashedPassword == user.password) {
        resolve(user)
      } else {
        reject(new Error(MSG_INVALID_CREDENTIALS))
      }
    })
  }
}

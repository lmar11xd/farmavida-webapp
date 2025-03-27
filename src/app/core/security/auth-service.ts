import { Injectable, NgZone } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { collection, Firestore, getDocs, query, where } from "@angular/fire/firestore";
import * as CryptoJS from 'crypto-js';
import { AES_SECRET_KEY, LOCAL_ROLE_ADMIN, LOCAL_ROLE_VENDEDOR, LOCAL_USER, MSG_INVALID_CREDENTIALS } from "../constants/constants";
import { UserRolEnum } from "../enums/user-rol.enum";
import { User } from "../models/user";

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
      createUserWithEmailAndPassword(this._auth, user.email, user.password)
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
      return this.loginAdmin(userData, userLogin.password)
    } else {
      return this.loginVendedor(userData, userLogin.password)
    }
  }

  logout() {
    return new Promise((resolve, reject) => {
        signOut(this._auth)
          .then(() => {
              this._ngZone.run(() => {
                this.removeLocalUser()
                resolve(true)
              })
          })
          .catch((error) => reject(error))
      }
    );
  }

  logoutVendedor() {
    this.removeLocalUser()
  }

  loginAdmin(user: User, password: string) {
    console.log('Logearse como Administrador')
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this._auth, user.email, password)
        .then((userCredential) => {
          this._ngZone.run(() => {
            this.saveLocalUser(user)
            resolve(userCredential)
          });
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

  loginVendedor(user: User, password: string) {
    console.log('Logearse como Vendedor')
    return new Promise((resolve, reject) => {
      const decodePassword = CryptoJS.AES.decrypt(user.password, AES_SECRET_KEY).toString(CryptoJS.enc.Utf8)
      if(decodePassword == password) {
        user.password = ''//Password no se debe visualizar en localStorage
        this.saveLocalUser(user)
        resolve(user)
      } else {
        reject(new Error(MSG_INVALID_CREDENTIALS))
      }
    })
  }

  saveLocalUser(user: User) {
    localStorage.setItem(LOCAL_USER, JSON.stringify(user))
    if(user.role == UserRolEnum.ADMINISTRADOR) {
      localStorage.setItem(LOCAL_ROLE_ADMIN, 'ADMIN')
    } else {
      localStorage.setItem(LOCAL_ROLE_VENDEDOR, 'VENDEDOR')
    }
  }

  removeLocalUser() {
    localStorage.removeItem(LOCAL_USER)
    localStorage.removeItem(LOCAL_ROLE_ADMIN)
    localStorage.removeItem(LOCAL_ROLE_VENDEDOR)
  }
}

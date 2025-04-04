import { Injectable, NgZone } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { collection, doc, Firestore, getDocs, query, setDoc, where } from "@angular/fire/firestore";
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

  async signup(user: UserLogin) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this._auth,
        user.email,
        user.password
      );
      return this._runInNgZone(() => userCredential);
    } catch (error) {
      throw error;
    }
  }

  async login(userLogin: UserLogin) {
    const q = query(
      collection(this._fireStore, "users"),
      where("username", "==", userLogin.username)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) throw new Error(MSG_INVALID_CREDENTIALS);

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data() as User;
    const userId = userDoc.id;

    return user.authentication
      ? this.loginDefault(user, userLogin.password)
      : this.loginAndRegister(user, userLogin.password, userId);
  }

  async logout() {
    try {
      await signOut(this._auth);
      this._runInNgZone(() => this.removeLocalUser());
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async loginDefault(user: User, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this._auth,
        user.email,
        password
      );

      user.password = "";
      this._runInNgZone(() => this.saveLocalUser(user));

      return userCredential;
    } catch (error: any) {
      const message = error.toString();
      if (
        message.includes("wrong-password") ||
        message.includes("user-not-found")
      ) {
        throw new Error(MSG_INVALID_CREDENTIALS);
      }
      throw error;
    }
  }

  private async loginAndRegister(user: User, password: string, userId: string) {
    try {
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        AES_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      if (decryptedPassword !== password) throw new Error(MSG_INVALID_CREDENTIALS);

      console.log("Usuario no tiene cuenta registrada, se procede a crearla");

      const userCredential = await createUserWithEmailAndPassword(
        this._auth,
        user.email,
        decryptedPassword
      );

      const userRef = doc(this._fireStore, `users/${userId}`);
      const updatedUser = { ...user, authentication: true };

      await setDoc(userRef, updatedUser, { merge: true });

      user.password = "";
      this._runInNgZone(() => this.saveLocalUser(user));

      return userCredential;
    } catch (error) {
      throw error;
    }
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

  private _runInNgZone<T>(fn: () => T): T {
    let result: T;
    this._ngZone.run(() => {
      result = fn();
    });
    return result!;
  }
}

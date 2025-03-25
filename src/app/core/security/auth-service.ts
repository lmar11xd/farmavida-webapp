import { Injectable, NgZone } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";

export interface User {
    email: string,
    password: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private _auth: Auth, private _ngZone: NgZone) {}

  session() {}

  signup(user: User) {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this._auth, user.email, user.password)
        .then((userCredential) => {
          this._ngZone.run(() => resolve(userCredential));
        })
        .catch((error) => reject(error));
      });
  }

  login(user: User) {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this._auth, user.email, user.password)
        .then((userCredential) => {
          this._ngZone.run(() => resolve(userCredential));
        })
        .catch((error) => reject(error));
      });
  }

  logout() {
    return new Promise((resolve, reject) => {
        signOut(this._auth)
            .then(() => {
                this._ngZone.run(() => resolve(true))
            })
            .catch((error) => reject(error))
    });
  }
}

import { inject, Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";

export interface User {
    email: string,
    password: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _auth = inject(Auth)

    session() {}

    signup(user: User) {
        return createUserWithEmailAndPassword(
            this._auth,
            user.email,
            user.password
        )
    }

    login(user: User) {
        return signInWithEmailAndPassword(
            this._auth,
            user.email,
            user.password
        )
    }

    logout() {
        return signOut(this._auth)
    }
}

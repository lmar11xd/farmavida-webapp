import { Injectable } from "@angular/core";
import { Auth, authState, signOut } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthStateService {

    constructor(private _auth: Auth) {}

    get authState$(): Observable<any> {
        return authState(this._auth)
    }

    logout() {
        return signOut(this._auth)
    }
}
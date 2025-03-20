import { Injectable } from "@angular/core";
import { WindowRef } from "./WindowRef";

@Injectable({
    providedIn: 'root' // ✅ Esto hace que esté disponible en toda la app
})
export class DbService {
    db: any;

    constructor(private winRef: WindowRef) {
        this.init()
    }

    init() {}

    setItem(id: string, objeto: any) {
        this.winRef.nativeWindow.localStorage.setItem(id, JSON.stringify(objeto))
    }


    getItem(id: string) {
        let objeto = this.winRef.nativeWindow.localStorage.getItem(id)
        if(objeto !== null) {
            return JSON.parse(objeto)
        } else {
            return null
        }
    }

    removeItem(id: string) {
        return this.winRef.nativeWindow.localStorage.removeItem(id)
    }
}
import { Injectable } from "@angular/core";
import { DbService } from "./db.service";

@Injectable({
    providedIn: 'root' // ✅ Esto hace que esté disponible en toda la app
})
export class SessionDbService {
    constructor(private dbService: DbService) {}

    saveSession(session: any) {
        try {
            this.dbService.setItem('SESSION', session)
        } catch (error) {
            
        }
    }

    getSession() {
        let sesion: any
        try {
            sesion = this.dbService.getItem('SESSION')
        } catch (error) {
            
        }
        return sesion
    }

    removeSession() {
        try {
            this.dbService.removeItem('SESSION')
        } catch (error) {
            
        }
    }
}
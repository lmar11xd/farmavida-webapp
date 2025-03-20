import { Injectable } from "@angular/core";
import { SettingsService } from "../settings/settings.service";
import { SessionDbService } from "../db/session-db.service";

@Injectable({
    providedIn: 'root' // ✅ Esto hace que esté disponible en toda la app
})
export class SessionLocalService {

    public session: any = {}

    constructor(
        private settings: SettingsService,
        private sessionService: SessionDbService
    ) {}

    setToken(token: any) {
        this.session.token = token
    }

    getToken() {
        return this.session.token
    }

    setExpiresIn(expires_in: any) {
        this.session.expires_in = expires_in
    }

    getExpiresIn() {
        return this.session.expires_in
    }

    saveSession(session: any) {
        this.sessionService.removeSession()
        this.sessionService.saveSession(session)
    }

    updateSession(session: any) {
        this.session = Object.assign({}, session)
    }

    getSession() {
        return this.session
    }

    removeSession() {
        this.sessionService.removeSession()
        this.session = {}
    }

    isAuthenticated(): boolean {
        let hasToken = false
        this.session = this.getSession()
        
        if(this.session !== null 
            && this.session.token !== null 
            && typeof this.session.token !== 'undefined' 
            && this.session.token !== '') {
            this.settings.setSession(this.session)

            let currentDate = new Date()
            let currentMilisec = currentDate.getTime()
            let daySession = new Date(this.session.expires_in)
            let daySessionEnd = new Date(daySession.getFullYear(), daySession.getMonth(), daySession.getDate(), 23, 59, 59, 0)

            if(daySessionEnd.getTime() > currentMilisec) {
                hasToken = true
            } else {
                this.removeSession()
            }
        }

        return hasToken
    }
}
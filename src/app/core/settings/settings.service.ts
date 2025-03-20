import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root' // ✅ Esto hace que esté disponible en toda la app
})
export class SettingsService {

    public session: any;
    public urlSessionOn: any;

    constructor() {
        this.session = {}
    }

    getSession() {
        return this.session
    }

    setSession(session: any) {
        this.session = Object.assign({}, session)
    }

    setUrlSessionOn(urlSessionOn: string) {
        this.urlSessionOn = urlSessionOn;
    }
    getUrlSessionOn() {
        return this.urlSessionOn;
    }

}

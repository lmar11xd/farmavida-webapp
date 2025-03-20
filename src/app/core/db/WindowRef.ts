import { Injectable } from "@angular/core";

function _window(): any {
    return window
}

@Injectable({
    providedIn: 'root' // ✅ Esto hace que esté disponible en toda la app
})
export class WindowRef {
    get nativeWindow(): any {
        return _window()
    }
}
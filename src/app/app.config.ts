import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//PrimeNG
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient } from '@angular/common/http';

//Angular Fire
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    MessageService,
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        },

        zIndex: {
          modal: 1100,    // dialog, sidebar
          overlay: 1000,  // dropdown, overlaypanel
          menu: 1000,     // overlay menus
          tooltip: 1100   // tooltip
      }
    }), 
    provideFirebaseApp(() => initializeApp({ 
      projectId: "app-with-firebase-db4cb", 
      appId: "1:719956771256:web:cfc2a7697d406e719c0f4d", 
      storageBucket: "app-with-firebase-db4cb.firebasestorage.app", 
      apiKey: "AIzaSyBPP17YEcHanyiIVMlFcJ_QKp6tEmzKKU8", 
      authDomain: "app-with-firebase-db4cb.firebaseapp.com", 
      messagingSenderId: "719956771256" })
    ), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())
  ]
};

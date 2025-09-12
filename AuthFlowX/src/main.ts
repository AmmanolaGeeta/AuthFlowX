import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from './environments/environment';

import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
//  Ionicons
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
// import { makeEnvironmentProviders } from '@angular/core';
// import { IonicStorageModule } from '@ionic/storage-angular';
// import { provideStorage } from '@ionic/storage-angular';

addIcons({
  eye,'eye-off': eyeOff
});

bootstrapApplication(AppComponent, {
  providers: [
     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes),
    // provideStorage(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error(err));
// function provideStorage(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
//   return makeEnvironmentProviders([
//     importProvidersFrom(IonicStorageModule.forRoot())
//   ]);
// }

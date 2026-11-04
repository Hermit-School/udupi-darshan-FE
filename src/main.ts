import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import the functions you need from the SDKs you need



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { firebaseConfig } from "src/constants/firebaseConfigConstants";


// Initialize Firebase
if (environment.production) {
  void Promise.all([import('firebase/app'), import('firebase/analytics')])
    .then(async ([{ initializeApp }, { isSupported, getAnalytics }]) => {
      if (await isSupported()) getAnalytics(initializeApp(firebaseConfig));
    }).catch(() => {});
}

if (environment.production) {
  enableProdMode();
}

platformBrowser().bootstrapModule(AppModule)
  .catch(err => console.error(err));

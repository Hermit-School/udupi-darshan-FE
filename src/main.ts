import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGTGKrUEJZsExjE9FfnqxzAsgdy1mckn8",
  authDomain: "udupi-darshan.firebaseapp.com",
  projectId: "udupi-darshan",
  storageBucket: "udupi-darshan.appspot.com",
  messagingSenderId: "184267438115",
  appId: "1:184267438115:web:a8a321bc57fb544f5b5996",
  measurementId: "G-H9V2CJGX4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

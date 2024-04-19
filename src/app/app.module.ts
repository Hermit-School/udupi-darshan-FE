// Path: src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppComponent } from './app.component';
import { FetchapiComponent } from './fetchapi/fetchapi.component';

@NgModule({
  declarations: [
    AppComponent,
    FetchapiComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule // Add HttpClientModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

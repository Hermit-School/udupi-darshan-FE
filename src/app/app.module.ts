import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router'; // Import RouterModule and Routes
import { AppComponent } from './app.component';
import { FetchapiComponent } from './fetchapi/fetchapi.component';

// Define your routes
const routes: Routes = [
  // Define your routes here, for example:
  // { path: 'fetchapi', component: FetchapiComponent },
  // Add more routes as needed
];

@NgModule({
  declarations: [
    AppComponent,
    FetchapiComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes) // Add RouterModule.forRoot() with your routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

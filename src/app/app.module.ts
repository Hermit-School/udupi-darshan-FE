import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
// Import DataService if needed
// import { DataService } from './data-service.service'; 
// Import ServiceComponent if needed
// import { ServiceComponent } from './service/service.component';
import { FetchapiComponent } from './fetchapi/fetchapi.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    // ServiceComponent, // Remove if not a component
    FetchapiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Add HttpClientModule to imports
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: '**', redirectTo: '/home', pathMatch: 'full' }
    ])
  ],
  providers: [], // Provide DataService here if needed
  bootstrap: [AppComponent]
})
export class AppModule { }

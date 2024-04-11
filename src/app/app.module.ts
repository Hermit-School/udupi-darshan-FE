import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
<<<<<<< Updated upstream
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent
=======
import { ContactFormComponent } from '../component/contact-form/contact-form.component'


@NgModule({
  declarations: [
    AppComponent,
    // NavbarComponent,
    ContactFormComponent
>>>>>>> Stashed changes
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
<<<<<<< Updated upstream
    NgbModule
=======
    FormsModule
  ],
  providers: [
    
>>>>>>> Stashed changes
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

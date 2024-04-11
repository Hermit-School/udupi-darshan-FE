import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContactFormComponent } from 'src/component/contact-form/contact-form.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



@NgModule({
  declarations: [
    AppComponent,
    ContactFormComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

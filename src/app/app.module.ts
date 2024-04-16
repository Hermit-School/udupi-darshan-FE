import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyFormComponent } from 'src/component/contact-form/contact-form.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms'; 



@NgModule({
  declarations: [
    AppComponent,
    MyFormComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

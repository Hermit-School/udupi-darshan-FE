import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ApicallService } from './services/apicall.service';
//import { ApiCommponent } from './services/api.component';
import { ApiCommponent } from './services/api.component';



const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    ApiCommponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ApicallService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

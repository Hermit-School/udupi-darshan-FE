import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigComponent } from 'src/app/config.component';
import {ConfigService} from 'src/service/config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule 
    
   
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }

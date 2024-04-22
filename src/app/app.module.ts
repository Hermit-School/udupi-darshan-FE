import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ConfigService } from 'src/service/config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([]) // Add RouterModule.forRoot() with an empty array for now
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }

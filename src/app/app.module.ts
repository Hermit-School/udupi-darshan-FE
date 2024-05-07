import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { NavbarComponent } from './component/navbar/navbar.component';
import { HeadingComponent } from './component/heading/heading.component';
import { ScrollableNavbarComponent } from './scrollable-navbar/scrollable-navbar.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { GutterComponent } from './gutter/gutter.component';


@NgModule({
  declarations: [
    AppComponent,
    
    NavbarComponent,
    HeadingComponent,
    ScrollableNavbarComponent,
    AdvertisementComponent,
    GutterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BentoComponent } from './components/bento/bento.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { CardContainerComponent } from './components/card-container/card-container.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingPageComponent,
    CarouselComponent,
    BentoComponent,
    AdvertisementComponent,
    CardContainerComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCarouselModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

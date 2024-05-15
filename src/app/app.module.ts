import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BentoComponent } from './components/bento/bento.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { ModalComponent } from './components/modal/modal.component';
import { PopupComponent } from './components/popup/popup.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingPageComponent,
    CarouselComponent,
    BentoComponent,
    AdvertisementComponent,
    BlogsComponent,
    FooterComponent,
    CardContainerComponent,
    ModalComponent,
    PopupComponent,
    
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCarouselModule,
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

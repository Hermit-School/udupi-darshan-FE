import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BentoComponent } from './components/bento/bento.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NatureComponent } from './pages/nature/nature.component'; // Import ReactiveFormsModule and FormsModule




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
    NatureComponent
   
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

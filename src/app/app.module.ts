//Module Imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbCarouselModule,NgbAlertModule,NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

//Component Imports
import { BentoComponent } from './components/bento/bento.component';
import { AppComponent } from './app.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { NatureComponent } from './pages/nature/nature.component';
import { CultureComponent } from './pages/culture/culture.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AdvertisementsComponent } from './pages/advertisements/advertisements.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
import { DashboardnavbarComponent } from './components/admin-dashboard-components/dashboardnavbar/dashboardnavbar.component';
import { DashboardrequesttableComponent } from './components/admin-dashboard-components/dashboardrequesttable/dashboardrequesttable.component';
import { ListFilterPipe } from '../app/util/list-filter';
import { StoryComponent } from './pages/story/story.component';

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
    NatureComponent,
    CultureComponent,
    AdminComponent,
    PagenotfoundComponent,
    ForgotpasswordComponent,
    LoadingComponent,
    AdvertisementsComponent,
    BlogDetailsComponent,
    AdmindashboardComponent,
    DashboardnavbarComponent,
    DashboardrequesttableComponent,
    ListFilterPipe,
    StoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
//Module Imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbCarouselModule, NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
import { DashboardnavbarComponent } from './components/admin-dashboard-components/dashboardnavbar/dashboardnavbar.component';
import { DashboardrequesttableComponent } from './components/admin-dashboard-components/dashboardrequesttable/dashboardrequesttable.component';
import { ListFilterPipe } from '../app/util/list-filter';
import { FoodComponent } from './pages/food/food.component';
import { StoryComponent } from './pages/story/story.component';
import { StoryDetailsComponent } from './pages/story-details/story-details.component';
import { MyHttpInterceptor } from './services/Interceptor/MyHttpInterceptor';
import { SearchComponent } from './components/search/search.component';
import { NewEntryComponent } from './components/admin-dashboard-components/new-entry/new-entry.component';
import { CacheInterceptor } from './services/Interceptor/CacheInterceptor';

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
    FoodComponent,
    StoryComponent,
    StoryDetailsComponent,
    SearchComponent,
    NewEntryComponent
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
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
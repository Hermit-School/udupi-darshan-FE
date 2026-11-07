import { RouteRecoveryComponent } from './components/route-recovery/route-recovery.component';
import { MediaImageInterceptor } from './services/Interceptor/MediaImageInterceptor';
import { VisitorMotionDirective } from './directives/visitor-motion.directive';
import { StorySubmissionComponent } from './components/story-submission/story-submission.component';
import { AuthInterceptor } from './services/Interceptor/AuthInterceptor';
//Module Imports
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbCarouselModule, NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

//Component Imports
import { BentoComponent } from './components/bento/bento.component';
import { AppComponent } from './app.component';
import { AdvertisementComponent } from './components/advertisement/advertisement.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DashboardrequesttableComponent } from './components/admin-dashboard-components/dashboardrequesttable/dashboardrequesttable.component';
import { ListFilterPipe } from '../app/util/list-filter';
import { MyHttpInterceptor } from './services/Interceptor/MyHttpInterceptor';
import { SearchComponent } from './components/search/search.component';
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
    PagenotfoundComponent,
    ForgotpasswordComponent,
    LoadingComponent,
    DashboardrequesttableComponent,
    ListFilterPipe,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    RouteRecoveryComponent,
    StorySubmissionComponent,
    VisitorMotionDirective,
    AppRoutingModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbModalModule,
    HttpClientModule,
    NgbPaginationModule
  ],
  providers: [provideZoneChangeDetection(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MediaImageInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

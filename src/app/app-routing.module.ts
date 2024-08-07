import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NatureComponent } from './pages/nature/nature.component';
import { CultureComponent } from 'src/app/pages/culture/culture.component';
import {AdvertisementsComponent} from 'src/app/pages/advertisements/advertisements.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component'; 
import { AdminComponent } from './pages/admin/admin.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
 import { DetailsComponent } from './pages/details/details.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { BlogDetailsComponent} from './components/blog-details/blog-details.component';
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
import { FoodComponent } from './pages/food/food.component';
import {StoryComponent} from 'src/app/pages/story/story.component';
import { StoryDetailsComponent } from './pages/story-details/story-details.component';

const routes: Routes = [
    // Default route
    { path: '', component: LandingPageComponent },
    { path: 'nature', component: NatureComponent },
    { path: 'culture', component: CultureComponent },
    { path: 'food', component: FoodComponent },
    {path:'advertisements',component:AdvertisementsComponent},
    { path: 'admin', component: AdminComponent },
    { path: 'home', component: LandingPageComponent },
    { path: 'details/:category/:id', component: DetailsComponent }, 
    { path: '404', component: PagenotfoundComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'admindashboard', component: AdmindashboardComponent },
    { path: 'blog/:id', component: BlogDetailsComponent },
    { path: 'story/:id', component: StoryDetailsComponent},
    { path: 'story', component:StoryComponent},
    { path: '**', redirectTo: '404', pathMatch: 'full' },
    
  ];
  @NgModule({
    imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', 
      useHash: true
    })],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
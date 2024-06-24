import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NatureComponent } from './pages/nature/nature.component';
import { CultureComponent } from 'src/app/pages/culture/culture.component';
import{AdvertisementsComponent} from 'src/app/pages/advertisements/advertisements.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component'; 
import { AdminComponent } from './pages/admin/admin.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
 import { DetailsComponent } from './pages/details/details.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
  
const routes: Routes = [
    // Default route
    { path: '', component: LandingPageComponent },
    { path: 'nature', component: NatureComponent },
    { path: 'culture', component: CultureComponent },
    {path:'advertisements',component:AdvertisementsComponent},
    { path: 'admin', component: AdminComponent },
    { path: 'home', component: LandingPageComponent },
    { path: 'details/:category/:id', component: DetailsComponent }, 
    { path: '404', component: PagenotfoundComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'admindashboard', component: AdmindashboardComponent },
    { path: '**', redirectTo: '404', pathMatch: 'full' },
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NatureComponent } from './pages/nature/nature.component';
import { CultureComponent } from 'src/app/pages/culture/culture.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component'; 
import { AdminComponent } from './pages/admin/admin.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
  
const routes: Routes = [
    // Default route
    { path: '', component: LandingPageComponent },
    { path: 'nature', component: NatureComponent },
    { path: 'culture', component: CultureComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'home', component: LandingPageComponent },
    { path: '404', component: PagenotfoundComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: '**', redirectTo: '404', pathMatch: 'full' },
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

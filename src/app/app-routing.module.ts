import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NatureComponent } from './pages/nature/nature.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component'; // Assume you have a LandingPageComponent



  const routes: Routes = [
    { path: '', component: LandingPageComponent }, // Default route
    { path: 'nature', component: NatureComponent },
   
    { path: 'landing', component: LandingPageComponent }
  ];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NatureComponent } from './pages/nature/nature.component';
import { CultureComponent } from 'src/app/pages/culture/culture.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component'; 
import { AdminComponent } from './pages/admin/admin.component';
  
const routes: Routes = [
    // Default route
    { path: 'nature', component: NatureComponent },
    { path: 'culture', component: CultureComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'landing', component: LandingPageComponent },
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

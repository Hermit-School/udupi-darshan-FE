import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CultureComponent } from './components/culture/culture.component';

const routes: Routes = [
  // { path: 'culture', component: CultureComponent },
  // { path: '', redirectTo: '/culture', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



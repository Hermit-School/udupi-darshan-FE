import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { NatureComponent } from './pages/nature/nature.component';
import { CultureComponent } from 'src/app/pages/culture/culture.component';
import { AdvertisementsComponent } from 'src/app/pages/advertisements/advertisements.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { DetailsComponent } from './pages/details/details.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { AdmindashboardComponent } from './pages/admindashboard/admindashboard.component';
import { FoodComponent } from './pages/food/food.component';
import { StoryComponent } from 'src/app/pages/story/story.component';
import { StoryDetailsComponent } from './pages/story-details/story-details.component';


const routes: Routes = [
  // Default route
  { path: '', component: LandingPageComponent, data: { title: 'Udupi Darshan - Explore Culture & Nature', metaDescription: 'Discover the best places in Udupi, including culture, food, nature, and stories.' } },
  { path: 'nature', component: NatureComponent, data: { title: 'Nature in Udupi - Explore Scenic Beauty', metaDescription: 'Experience the natural beauty of Udupi with beaches, forests, and more.' } },
  { path: 'culture', component: CultureComponent, data: { title: 'Culture of Udupi - Traditions & Heritage', metaDescription: 'Dive into the rich cultural heritage of Udupi, including traditions, temples, and history.' } },
  { path: 'food', component: FoodComponent, data: { title: 'Udupi Food - Famous Dishes & Cuisine', metaDescription: 'Taste the delicious Udupi cuisine with authentic South Indian flavors and iconic dishes.' } },
  { path: 'advertisements', component: AdvertisementsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'details/:category/:id', component: DetailsComponent },
  { path: '404', component: PagenotfoundComponent, data: { title: 'Page Not Found - Udupi Darshan', metaDescription: 'Oops! The page you are looking for does not exist. Explore Udupi Darshan for more content.' } },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'admindashboard', component: AdmindashboardComponent },
  { path: 'blog/:id', component: BlogDetailsComponent },
  { path: 'story/:id', component: StoryDetailsComponent },
  { path: 'story', component: StoryComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private titleService: Title, private metService: Meta, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let currentRoute = this.router.routerState.snapshot.root;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        if (currentRoute.data) {
          const title = currentRoute.data['title'];
          const metaDescription = currentRoute.data['metaDescription'];

          if (title) this.titleService.setTitle(title);
          if (metaDescription) {
            this.metService.updateTag({ name: 'description', content: metaDescription });
          }
        }
      }
    });
  }
}
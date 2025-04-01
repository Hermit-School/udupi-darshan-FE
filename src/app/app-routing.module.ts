import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ROUTES } from '../constants/routes'
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
  { path: ROUTES.HOME.path, component: LandingPageComponent, data: { title: ROUTES.HOME.title, metaDescription: ROUTES.HOME.metaDescription } },
  { path: ROUTES.NATURE.path, component: NatureComponent, data: { title: ROUTES.NATURE.title, metaDescription: ROUTES.NATURE.metaDescription } },
  { path: ROUTES.CULTURE.path, component: CultureComponent, data: { title: ROUTES.CULTURE.title, metaDescription: ROUTES.CULTURE.metaDescription } },
  { path: ROUTES.FOOD.path, component: FoodComponent, data: { title: ROUTES.FOOD.title, metaDescription: ROUTES.FOOD.metaDescription } },
  { path: ROUTES.ADVERTISEMENTS.path, component: AdvertisementsComponent },
  { path: ROUTES.ADMIN.path, component: AdminComponent },
  { path: ROUTES.LANDING.path, component: LandingPageComponent },
  { path: ROUTES.DETAILS.path, component: DetailsComponent },
  { path: ROUTES.NOT_FOUND.path, component: PagenotfoundComponent, data: { title: ROUTES.NOT_FOUND.title, metaDescription: ROUTES.NOT_FOUND.metaDescription } },
  { path: ROUTES.FORGOT_PASSWORD.path, component: ForgotpasswordComponent },
  { path: ROUTES.ADMIN_DASHBOARD.path, component: AdmindashboardComponent },
  { path: ROUTES.BLOG_DETAILS.path, component: BlogDetailsComponent },
  { path: ROUTES.STORY_DETAILS.path, component: StoryDetailsComponent },
  { path: ROUTES.STORY.path, component: StoryComponent },
  { path: ROUTES.WILDCARD.path, redirectTo: ROUTES.WILDCARD.redirectTo, pathMatch: ROUTES.WILDCARD.pathMatch }
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
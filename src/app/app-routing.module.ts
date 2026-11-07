import { adminGuard } from './guards/admin.guard';
import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ROUTES } from '../constants/routes'
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';


const routes: Routes = [
  {path:'admindashboard/homepage',loadComponent:()=>import('./pages/homepage-editor/homepage-editor.component').then(m=>m.HomepageEditorComponent),canActivate:[adminGuard],canDeactivate:[(component: import('./pages/homepage-editor/homepage-editor.component').HomepageEditorComponent)=>!component.dirty && !component.busy || confirm('Leave the homepage editor? Unsaved changes will be lost.')],data:{hidePublicChrome:true,title:'Design homepage | Udupi Darshan'}},
  { path: ROUTES.HOME.path, component: LandingPageComponent, data: { title: ROUTES.HOME.title, metaDescription: ROUTES.HOME.metaDescription } },
  { path: ROUTES.NATURE.path, loadComponent: () => import('./pages/nature/nature.component').then(m => m.NatureComponent), data: { title: ROUTES.NATURE.title, metaDescription: ROUTES.NATURE.metaDescription } },
  { path: ROUTES.CULTURE.path, loadComponent: () => import('./pages/culture/culture.component').then(m => m.CultureComponent), data: { title: ROUTES.CULTURE.title, metaDescription: ROUTES.CULTURE.metaDescription } },
  { path: ROUTES.FOOD.path, loadComponent: () => import('./pages/food/food.component').then(m => m.FoodComponent), data: { title: ROUTES.FOOD.title, metaDescription: ROUTES.FOOD.metaDescription } },
  { path: ROUTES.ADVERTISEMENTS.path, loadComponent: () => import('./pages/advertisements/advertisements.component').then(m => m.AdvertisementsComponent) },
  {path:'events',loadComponent:()=>import('./pages/events/events.component').then(m=>m.EventsComponent),data:{title:'Events in Udupi | Udupi Darshan'}},
  {path:'events/:id',loadComponent:()=>import('./pages/events/events.component').then(m=>m.EventsComponent),data:{title:'Community event | Udupi Darshan'}},
  {path:'admindashboard/content/:type',loadComponent:()=>import('./pages/content-manager/content-manager.component').then(m=>m.ContentManagerComponent),canActivate:[adminGuard],data:{hidePublicChrome:true,title:'Edit records | Udupi Darshan'}},
  {path:'edit-entry/:type/:id',loadComponent:()=>import('./pages/content-editor/content-editor.component').then(m=>m.ContentEditorComponent),canActivate:[adminGuard],data:{hidePublicChrome:true,title:'Edit record | Udupi Darshan'}},
  { path: 'new-entry', redirectTo: 'new-entry/nature', pathMatch: 'full' },
  { path: 'new-entry/:type', loadComponent: () => import('./pages/content-editor/content-editor.component').then(m => m.ContentEditorComponent), canActivate: [adminGuard], data: { title: 'Add content | Udupi Darshan', hidePublicChrome: true } },
  { path: ROUTES.ADMIN.path, loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), data: { title: 'Admin sign in | Udupi Darshan', hidePublicChrome: true } },
  { path: ROUTES.LANDING.path, component: LandingPageComponent },
  { path: ROUTES.DETAILS.path, loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent) },
  ...['nature', 'culture', 'food'].map(legacyCategory => ({
    path: legacyCategory + '/:id', loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent), data: { legacyCategory },
  })),
  { path: 'admindashboard/stories', loadComponent: () => import('./pages/story-review/story-review.component').then(m => m.StoryReviewComponent), canActivate: [adminGuard], data: {title: 'Story submissions | Udupi Darshan', hidePublicChrome: true} },
  { path: 'dashboard', redirectTo: ROUTES.ADMIN_DASHBOARD.path, pathMatch: 'full' },
  { path: ROUTES.NOT_FOUND.path, component: PagenotfoundComponent, data: { title: ROUTES.NOT_FOUND.title, metaDescription: ROUTES.NOT_FOUND.metaDescription } },
  { path: ROUTES.FORGOT_PASSWORD.path, component: ForgotpasswordComponent },
  { path: ROUTES.ADMIN_DASHBOARD.path, loadComponent: () => import('./pages/admindashboard/admindashboard.component').then(m => m.AdmindashboardComponent), canActivate: [adminGuard], data: { title: 'Admin dashboard | Udupi Darshan', hidePublicChrome: true } },
  { path: ROUTES.BLOG_DETAILS.path, loadComponent: () => import('./components/blog-details/blog-details.component').then(m => m.BlogDetailsComponent) },
  { path: ROUTES.STORY_DETAILS.path, loadComponent: () => import('./pages/story-details/story-details.component').then(m => m.StoryDetailsComponent) },
  { path: ROUTES.STORY.path, loadComponent: () => import('./pages/story/story.component').then(m => m.StoryComponent) },
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

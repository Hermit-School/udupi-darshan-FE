import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HomepageService, HomeView } from '../../services/homepage.service';
@Component({standalone:false,selector:'app-landing-page',templateUrl:'./landing-page.component.html',styleUrls:['./landing-page.component.scss']})
export class LandingPageComponent {
 layout:HomeView|null=null;
 constructor(){inject(HomepageService).publicLayout().pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe({next:view=>this.layout=view,error:()=>this.layout=null});}
}

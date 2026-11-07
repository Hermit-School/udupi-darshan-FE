import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HomepageService, HomeView } from '../../services/homepage.service';
@Component({standalone:false,selector:'app-landing-page',templateUrl:'./landing-page.component.html',styleUrls:['./landing-page.component.scss']})
export class LandingPageComponent {
 layout:HomeView|null=null;
 loading=true;
 failed=false;
 private readonly homepage=inject(HomepageService);
 private readonly destroy=inject(DestroyRef);
 constructor(){this.load();}
 load():void {
  this.loading=true;this.failed=false;
  this.homepage.publicLayout().pipe(takeUntilDestroyed(this.destroy),finalize(()=>this.loading=false)).subscribe({
   next:view=>this.layout=view,
   error:()=>{this.layout=null;this.failed=true;},
  });
 }
}

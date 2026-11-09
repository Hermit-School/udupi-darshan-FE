import { EventBadgeComponent } from '../event-badge/event-badge.component';
import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, timer, Subject, switchMap, catchError, of } from 'rxjs';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from '../../services/background-request';
export interface ChoukhatEvent {id:string;title:string;date:string;time:string;fee:string;description:string;image:string|null;registrationUrl:string|null;venue:string;}
export interface ChoukhatFeed {sourceUrl:string;updatedAt:string|null;nextRefreshAt:string|null;stale:boolean;events:ChoukhatEvent[];}
@Component({standalone:true,selector:'app-choukhat-events',imports:[EventBadgeComponent,CommonModule],templateUrl:'./choukhat-events.component.html',styleUrls:['./choukhat-events.component.scss']})
export class ChoukhatEventsComponent {
 readonly source='https://www.choukhat.in/events-in-manipal';
 private http=inject(HttpClient);private destroy=inject(DestroyRef);private refresh=new Subject<void>();
 feed:ChoukhatFeed|null=null;loading=true;failed=false;
 constructor(){
  merge(timer(0,24*60*60*1000),this.refresh).pipe(switchMap(()=>{
   this.loading=true;this.failed=false;
   return this.http.get<ChoukhatFeed>(API_BASE_URL+'/v1/events/choukhat',{context:new HttpContext().set(BACKGROUND_REQUEST,true)}).pipe(catchError(()=>{this.failed=true;return of(null);}));
  }),takeUntilDestroyed(this.destroy)).subscribe(value=>{if(value && Array.isArray(value.events))this.feed=value;else this.failed=true;this.loading=false;});
 }
 retry(){this.refresh.next();}
 private today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
 get upcoming(){return this.feed?.events.filter(e=>e.date>=this.today())||[];}
 get past(){return this.feed?.events.filter(e=>e.date<this.today()).slice().reverse()||[];}
}

import {Component,HostListener,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import {forkJoin,timeout} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AD_TIERS,AdTier,LocalAdvertisement,adTier} from '../../content/ad-tiers';
interface Item {id:number;size:AdTier;}
interface State {revision:string;items:Item[];}
@Component({standalone:true,imports:[CommonModule,FormsModule,RouterLink],selector:'app-advertisement-layout',templateUrl:'./advertisement-layout.component.html',styleUrls:['./advertisement-layout.component.scss']})
export class AdvertisementLayoutComponent implements OnInit {
 readonly sizes=AD_TIERS;items:Item[]=[];ads=new Map<number,LocalAdvertisement>();revision='';baseline='';loading=true;busy=false;error='';notice='';dragging:number|null=null;over:number|null=null;broken=new Set<number>();
 constructor(private http:HttpClient){}
 ngOnInit(){this.load();}
 get dirty(){return this.baseline!==''&&JSON.stringify(this.items)!==this.baseline;}
 @HostListener('window:beforeunload',['$event']) beforeUnload(event:BeforeUnloadEvent){if(this.dirty||this.busy)event.preventDefault();}
 load(){if(this.busy)return;this.loading=true;this.error='';this.notice='';
  forkJoin({state:this.http.get<State>(environment.apiBaseUrl+'/v1/admin/advertisement-layout'),ads:this.http.get<LocalAdvertisement[]>(environment.apiBaseUrl+'/v1/ads')}).pipe(timeout(15000)).subscribe({next:({state,ads})=>{
   const byId=new Map(ads.map(ad=>[ad.id,ad]));
   if(state.items.length!==ads.length||state.items.some(item=>!byId.has(item.id))){this.error='Advertisements changed while loading. Reload the layout.';this.loading=false;return;}
   this.ads=byId;this.items=state.items.map(item=>({...item,size:adTier(item.size)}));this.revision=state.revision;this.baseline=JSON.stringify(this.items);this.loading=false;
  },error:()=>{this.error='Could not load the advertisements. Try again.';this.loading=false;}});
 }
 reload(){if(!this.dirty||confirm('Discard your unsaved layout changes and reload?'))this.load();}
 size(item:Item,value:string){if(this.busy)return;item.size=adTier(value);this.notice='';}
 span(size:AdTier){return this.sizes.find(t=>t.id===size)!.span;}
 move(from:number,to:number){if(this.busy||to<0||to>=this.items.length||from===to)return;const next=[...this.items];const [item]=next.splice(from,1);next.splice(to,0,item);this.items=next;this.notice='Moved '+this.ads.get(item.id)?.title+' to position '+(to+1)+'.';}
 start(event:DragEvent,index:number){if(this.busy){event.preventDefault();return;}this.dragging=index;event.dataTransfer?.setData('text/plain',String(index));if(event.dataTransfer)event.dataTransfer.effectAllowed='move';}
 dragover(event:DragEvent,index:number){if(this.dragging===null||this.busy)return;event.preventDefault();this.over=index;if(event.dataTransfer)event.dataTransfer.dropEffect='move';}
 drop(event:DragEvent,index:number){event.preventDefault();if(this.dragging!==null)this.move(this.dragging,index);this.end();}
 end(){this.dragging=null;this.over=null;}
 reset(){if(this.busy)return;this.items=JSON.parse(this.baseline);this.notice='Unsaved changes discarded.';this.error='';}
 save(){if(this.busy||!this.dirty)return;this.busy=true;this.error='';this.notice='';
  this.http.put<State>(environment.apiBaseUrl+'/v1/admin/advertisement-layout',{revision:this.revision,items:this.items}).pipe(timeout(15000)).subscribe({next:state=>{this.items=state.items;this.revision=state.revision;this.baseline=JSON.stringify(this.items);this.busy=false;this.notice='Layout saved. Support local now uses this order and these sizes.';},error:(error:HttpErrorResponse)=>{this.busy=false;this.error=error.status===409?'The advertisements changed since you opened this page. Reload before saving.':error.status===401||error.status===403?'Sign in with an administrator account to save.':'Could not confirm the save. Reload to check the published layout before trying again.';}});
 }
}

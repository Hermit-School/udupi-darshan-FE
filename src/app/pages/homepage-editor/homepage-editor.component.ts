import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, finalize, switchMap } from 'rxjs';
import { HomepageService, HomeCard, HomeLayout, HomeRef, HomeView, Zone } from '../../services/homepage.service';
import { HomepageViewComponent, HomeAction } from '../../components/homepage-view/homepage-view.component';
import { imagePreview } from '../../util/media-image';
@Component({standalone:true,selector:'app-homepage-editor',imports:[FormsModule,RouterLink,HomepageViewComponent],templateUrl:'./homepage-editor.component.html',styleUrls:['./homepage-editor.component.scss']})
export class HomepageEditorComponent {
 private api=inject(HomepageService);private destroy=inject(DestroyRef);
 cards:HomeCard[]=[];layout:HomeLayout|null=null;version=0;published=false;loading=true;busy=false;dirty=false;
 query='';kind='all';notice='';error='';conflict=false;mobile=false;
 readonly kinds=['all','nature','culture','food','story','events','ads'];image=imagePreview;
 constructor(){this.load();}
 load(){
  this.loading=true;this.error='';
  forkJoin({state:this.api.state(),cards:this.api.cards()}).pipe(takeUntilDestroyed(this.destroy),finalize(()=>this.loading=false)).subscribe({
   next:({state,cards})=>{this.cards=cards;this.layout=structuredClone(state.draft);this.layout.sponsorsPerRow??=3;this.version=state.version;this.published=state.published;this.dirty=false;this.conflict=false;},
   error:()=>this.error='Unable to load the editor. Please try again.',
  });
 }
 reload(){if(!this.dirty || confirm('Reload the saved draft? Unsaved changes will be lost.'))this.load();}
 @HostListener('window:beforeunload',['$event']) beforeUnload(event:BeforeUnloadEvent){if(this.dirty || this.busy)event.preventDefault();}
 get filtered(){const query=this.query.trim().toLowerCase();return this.cards.filter(c=>(this.kind==='all'||c.kind===this.kind)&&[c.title,c.kind,c.summary].join(' ').toLowerCase().includes(query));}
 key(c:{kind:string;id:number}){return c.kind+':'+c.id;}
 refs(zone:Zone):HomeRef[]{return !this.layout?[]:zone==='hero'?(this.layout.hero?[this.layout.hero]:[]):this.layout[zone];}
 selected(card:HomeCard){return (['hero','features','sponsors'] as Zone[]).some(z=>this.refs(z).some(r=>this.key(r)===this.key(card)));}
 changed(){this.dirty=true;this.notice='';this.error='';}
 private resolve(ref:HomeRef|null):HomeCard|null{
  if(!ref)return null;const card=this.cards.find(c=>this.key(c)===this.key(ref));
  return card?{...card,image:card.images[ref.imageIndex]||card.image}:null;
 }
 get missing(){return (['hero','features','sponsors'] as Zone[]).flatMap(z=>this.refs(z)).filter(r=>!this.resolve(r)).length;}
 removeMissing(){if(!this.layout)return;this.layout.hero=this.resolve(this.layout.hero)?this.layout.hero:null;this.layout.features=this.layout.features.filter(r=>this.resolve(r));this.layout.sponsors=this.layout.sponsors.filter(r=>this.resolve(r));this.changed();}
 get preview():HomeView{
  const l=this.layout!;return {configured:true,title:l.title,intro:l.intro,sectionTitle:l.sectionTitle,hero:this.resolve(l.hero),features:l.features.map(r=>this.resolve(r)).filter((c):c is HomeCard=>!!c),sponsorsPerRow:l.sponsorsPerRow??3,sponsors:l.sponsors.map(r=>this.resolve(r)).filter((c):c is HomeCard=>!!c)};
 }
 add(card:HomeCard,zone:Zone){this.place(card,zone,this.refs(zone).length);}
 private place(card:HomeCard,zone:Zone,index:number){
  if(!this.layout || this.busy)return;
  if((zone==='sponsors')!==(card.kind==='ads')){this.error='Place advertisements in the Sponsored section, and editorial cards in the spotlight or featured section.';return;}
  const from=(['hero','features','sponsors'] as Zone[]).find(z=>this.refs(z).some(r=>this.key(r)===this.key(card)));
  const oldIndex=from?this.refs(from).findIndex(r=>this.key(r)===this.key(card)):-1;
  if(zone!=='hero' && from!==zone && this.refs(zone).length>=(zone==='features'?12:30)){this.error='This section is full. Remove a card before adding another.';return;}
  const ref=from?{...this.refs(from)[oldIndex]}:{kind:card.kind,id:card.id,imageIndex:0};
  if(from===zone && oldIndex<index)index--;
  if(from==='hero')this.layout.hero=null;
  else if(from)this.layout[from].splice(oldIndex,1);
  if(zone==='hero')this.layout.hero=ref;
  else this.layout[zone].splice(index,0,ref);
  this.changed();
 }
 action(event:HomeAction){
  if(!this.layout || this.busy)return;const refs=this.refs(event.zone),ref=refs[event.index];if(!ref)return;
  if(event.type==='photo')ref.imageIndex=event.photo||0;
  else if(event.type==='remove'){if(event.zone==='hero')this.layout.hero=null;else this.layout[event.zone].splice(event.index,1);}
  else {const next=event.index+(event.type==='up'?-1:1);if(next<0||next>=refs.length)return;[refs[event.index],refs[next]]=[refs[next],refs[event.index]];}
  this.changed();
 }
 drag(event:DragEvent,card:HomeCard){event.dataTransfer?.setData('text/plain',JSON.stringify({kind:card.kind,id:card.id}));if(event.dataTransfer)event.dataTransfer.effectAllowed='copyMove';}
 drop(event:{data:string;zone:Zone;index:number}){
  try{const ref=JSON.parse(event.data);const card=this.cards.find(c=>c.kind===ref.kind&&c.id===ref.id);if(card)this.place(card,event.zone,event.index);}catch{/* Ignore files and unrelated drag data. */}
 }
 save(publish=false){
  if(!this.layout || this.busy || this.conflict)return;
  this.busy=true;this.error='';this.notice='';
  this.api.save(this.version,this.layout).pipe(switchMap(state=>{this.version=state.version;this.dirty=false;return publish?this.api.publish(state.version):[state];}),takeUntilDestroyed(this.destroy),finalize(()=>this.busy=false)).subscribe({
   next:state=>{this.version=state.version;this.published=state.published;this.notice=publish?'Homepage published. Visitors will see this layout on their next visit.':'Draft saved. The public homepage has not changed.';},
   error:error=>{this.conflict=error.status===409;this.error=this.conflict?'Another editor changed this homepage. Reload the saved draft before saving again.':error.error?.detail||'Unable to save. Your changes are still here. Please try again.';},
  });
 }
}

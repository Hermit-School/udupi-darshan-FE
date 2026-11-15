import {adExternal} from '../../content/ad-tiers';
import { EventBadgeComponent } from '../event-badge/event-badge.component';
import { SearchComponent } from '../search/search.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeCard, HomeView, Zone } from '../../services/homepage.service';
import { imagePreview } from '../../util/media-image';
export interface HomeAction {type:'remove'|'up'|'down'|'photo';zone:Zone;index:number;photo?:number;}
@Component({selector:'app-homepage-view',standalone:true,imports:[EventBadgeComponent,FormsModule,SearchComponent],templateUrl:'./homepage-view.component.html',styleUrls:['./homepage-view.component.scss','./homepage-sponsors.scss']})
export class HomepageViewComponent {
 @Input({required:true}) view!:HomeView;
 @Input() editing=false;
 @Output() action=new EventEmitter<HomeAction>();
 @Output() cardDrop=new EventEmitter<{data:string;zone:Zone;index:number}>();
 readonly sections=[{zone:'hero' as Zone,title:'Main spotlight',limit:1},{zone:'features' as Zone,title:'Featured cards',limit:12},{zone:'sponsors' as Zone,title:'Featured Partner',limit:30}];
 heading(zone:Zone,title:string){return zone==='features'?this.view.sectionTitle:zone==='sponsors'?(this.view.sponsorsTitle?.trim()||'Featured Partner'):title;}
 get sponsorColumns(){const count=this.view.sponsorsPerRow??3;return Number.isInteger(count)&&count>=1&&count<=5?count:3;}
 internal(card:HomeCard){const path=card.internalHref??card.href;return path&&/^\/advertisements(?:\/(?:[a-z][a-z0-9-]{0,99}|[1-9][0-9]*))?$/.test(path)?path:null;}
 website(card:HomeCard){return adExternal(card.website??card.href);}
 href(card:HomeCard){if(this.editing)return null;if(card.kind==='ads'){const path=this.internal(card);return path?'#'+path:this.website(card);}return !card.href?null:card.href.toLowerCase().startsWith('https://')?card.href:'#'+card.href;}
 newTab(card:HomeCard){const href=this.href(card);return !!href&&(card.kind==='ads'||href.toLowerCase().startsWith('https://'));}
 image=imagePreview;
 cards(zone:Zone):HomeCard[]{return zone==='hero'?(this.view.hero?[this.view.hero]:[]):this.view[zone];}
 edit(type:HomeAction['type'],zone:Zone,index:number,photo?:number){this.action.emit({type,zone,index,photo});}
 drag(event:DragEvent,card:HomeCard,zone:Zone,index:number){event.dataTransfer?.setData('text/plain',JSON.stringify({kind:card.kind,id:card.id,zone,index}));if(event.dataTransfer)event.dataTransfer.effectAllowed='move';}
 allow(event:DragEvent){if(this.editing)event.preventDefault();}
 drop(event:DragEvent,zone:Zone,index:number){if(!this.editing)return;event.preventDefault();event.stopPropagation();this.cardDrop.emit({data:event.dataTransfer?.getData('text/plain')||'',zone,index});}
 photo(event:Event,zone:Zone,index:number){this.edit('photo',zone,index,Number((event.target as HTMLSelectElement).value));}
}

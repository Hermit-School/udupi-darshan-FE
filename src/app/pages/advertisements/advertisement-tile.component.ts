import {Component,Input,HostBinding} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AD_TIERS,LocalAdvertisement,adTier,adWebsite,adPath,adExternal} from '../../content/ad-tiers';
@Component({standalone:true,imports:[RouterLink],selector:'app-advertisement-tile',templateUrl:'./advertisement-tile.component.html',styleUrls:['./advertisement-tile.component.scss'],host:{role:'article'}})
export class AdvertisementTileComponent {
 @Input({required:true}) ad!:LocalAdvertisement;@Input() viewportWidth=1280;@Input() viewportHeight=900;
 private measured=0;private measuredHeight=0;readonly broken=new Set<string>();external=adWebsite;internal=adPath;mapUrl=adExternal;
 tier(ad:LocalAdvertisement){return adTier(ad.width&&ad.width>0?ad.width:this.measured);}
 @HostBinding('class') get classes(){return 'ad-tile tier-'+this.tier(this.ad);}
 @HostBinding('attr.data-tier') get tierName(){return this.tier(this.ad);}
 @HostBinding('attr.data-id') get id(){return this.ad.id;}
 @HostBinding('style.height.px') get height(){const t=this.tier(this.ad);return t==='showcase'?(this.viewportWidth<700?520:Math.max(320,Math.round(this.viewportHeight/2))):t==='large'?460:t==='medium'?320:236;}
 @HostBinding('style.grid-column') get columns(){return 'span '+(this.viewportWidth<700?12:this.viewportWidth<1100?(this.tier(this.ad)==='showcase'?12:6):AD_TIERS.find(t=>t.id===this.tier(this.ad))!.span);}
 @HostBinding('style.grid-row') get rows(){return 'span '+(this.height+(this.viewportWidth<700?14:this.viewportWidth<1200?20:24));}
 loaded(ad:LocalAdvertisement,event:Event){const img=event.target as HTMLImageElement;if(img.naturalWidth){this.measured=img.naturalWidth;this.measuredHeight=img.naturalHeight;}}
 maxWidth(){return this.ad.width||this.measured||null;}
 maxHeight(){return this.ad.height||this.measuredHeight||null;}
 tint(ad:LocalAdvertisement){return /^#[0-9a-f]{6}$/i.test(ad.business?.backgroundColor||'')?ad.business!.backgroundColor:'#ece3d6';}
 phone(ad:LocalAdvertisement){const v=ad.business?.phone;return v&&/^[+0-9() .-]{5,30}$/.test(v)&&v.replace(/\D/g,'').length>=5?'tel:'+v.replace(/[^+0-9]/g,''):null;}
 summary(ad:LocalAdvertisement){return (ad.description||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
}

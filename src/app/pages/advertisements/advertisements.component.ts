import {AdvertisementTileComponent} from './advertisement-tile.component';
import {AdvertisementEnquiryComponent} from './advertisement-enquiry.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, HostListener, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, forkJoin, map, of, startWith, Subject, switchMap, tap, timeout } from 'rxjs';
import { API_BASE_URL } from 'src/constants/routes';
import { LocalAdvertisement, adWebsite, adExternal } from '../../content/ad-tiers';
@Component({standalone:true,imports:[CommonModule,RouterLink,AdvertisementTileComponent,AdvertisementEnquiryComponent],selector:'app-advertisements',templateUrl:'./advertisements.component.html',styleUrls:['./advertisements.component.scss']})
export class AdvertisementsComponent {
 private readonly http=inject(HttpClient);private readonly destroyRef=inject(DestroyRef);private readonly route=inject(ActivatedRoute);
 private readonly refresh=new Subject<void>();
 @ViewChild('enquiry') enquiry?:AdvertisementEnquiryComponent;

 publishedAds:LocalAdvertisement[]=[];current:LocalAdvertisement|null=null;detailId:string|null=null;loading=true;error='';selectedPhoto=0;
 readonly broken=new Set<string>();
 viewportWidth=globalThis.innerWidth||1280;viewportHeight=globalThis.innerHeight||900;
 constructor(){combineLatest([this.route.paramMap,this.refresh.pipe(startWith(undefined))]).pipe(
  tap(([params])=>{this.detailId=params.get('id');this.loading=true;this.error='';this.current=null;this.publishedAds=[];this.selectedPhoto=0;}),
  switchMap(()=>{
   const listing=this.http.get<LocalAdvertisement[]>(API_BASE_URL+'/v1/ads').pipe(timeout(15000),map(items=>Array.isArray(items)?items:[]));
   if(!this.detailId)return listing.pipe(map(ads=>({ads,current:null as LocalAdvertisement|null})),catchError(()=>of({ads:[],current:null,error:'Advertisements could not be loaded. Please try again later.'})));
   const id=this.detailId;const path=/^\d+$/.test(id)?'/':'/page/';
   return forkJoin({current:this.http.get<LocalAdvertisement>(API_BASE_URL+'/v1/ads'+path+encodeURIComponent(id)).pipe(timeout(15000)),ads:listing.pipe(catchError(()=>of([])))}).pipe(catchError(()=>of({ads:[],current:null,error:'This advertisement is unavailable.'})));
  }),takeUntilDestroyed(this.destroyRef)
 ).subscribe(result=>{this.publishedAds=result.ads;this.current=result.current;this.error='error' in result?result.error:'';this.loading=false;});}
 @HostListener('window:resize') resize(){this.viewportWidth=innerWidth;this.viewportHeight=innerHeight;}
 retry(){this.refresh.next();}
 external=adWebsite;mapUrl=adExternal;
 get related(){return this.current?this.publishedAds.filter(ad=>ad.id!==this.current!.id).slice(0,4):[];}
 get photos(){const ad=this.current;return ad?[...new Set(ad.images?.length?ad.images:[ad.imageUrl])].filter(Boolean):[];}
 get activePhoto(){return this.photos[this.selectedPhoto]||this.photos[0];}
 phone(ad:LocalAdvertisement){const value=ad.business?.phone;return value&&/^[+0-9() .-]{5,30}$/.test(value)&&value.replace(/\D/g,'').length>=5?'tel:'+value.replace(/[^+0-9]/g,''):null;}
 tint(ad:LocalAdvertisement){return /^#[0-9a-f]{6}$/i.test(ad.business?.backgroundColor||'')?ad.business!.backgroundColor:'#ece3d6';}
 openGrow(){this.enquiry?.open();}
}

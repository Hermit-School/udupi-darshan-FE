import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from './background-request';
export type HomeKind = 'nature'|'culture'|'food'|'story'|'events'|'ads';
export type Zone = 'hero'|'features'|'sponsors';
export interface HomeRef {kind:HomeKind;id:number;imageIndex:number;}
export interface HomeCard {kind:HomeKind;id:number;title:string;summary:string;images:string[];href:string;image:string|null;eventDate?:string|null;eventEndDate?:string|null;}
export interface HomeLayout {title:string;intro:string;sectionTitle:string;hero:HomeRef|null;features:HomeRef[];sponsors:HomeRef[];}
export interface HomeState {version:number;draft:HomeLayout;published:boolean;}
export interface HomeView {configured:boolean;title:string;intro:string;sectionTitle:string;hero:HomeCard|null;features:HomeCard[];sponsors:HomeCard[];}
@Injectable({providedIn:'root'})
export class HomepageService {
 private http=inject(HttpClient);private url=API_BASE_URL+'/v1/admin/landing-layout';
 state(){return this.http.get<HomeState>(this.url);}
 cards(){return this.http.get<HomeCard[]>(this.url+'/cards');}
 save(version:number,layout:HomeLayout){return this.http.put<HomeState>(this.url+'/draft',{version,layout});}
 publish(version:number){return this.http.post<HomeState>(this.url+'/publish',{version});}
 publicLayout(){return this.http.get<HomeView>(API_BASE_URL+'/v1/landing-layout',{context:new HttpContext().set(BACKGROUND_REQUEST,true)});}
}

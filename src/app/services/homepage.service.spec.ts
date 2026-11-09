import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomepageService, HomeView } from './homepage.service';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from './background-request';
describe('Homepage event date fallback',()=>{
 let api:HomepageService,http:HttpTestingController;
 beforeEach(()=>{TestBed.configureTestingModule({imports:[HttpClientTestingModule]});api=TestBed.inject(HomepageService);http=TestBed.inject(HttpTestingController);});
 afterEach(()=>http.verify());
 const view=(eventDate?:string):HomeView=>({configured:true,title:'Udupi',intro:'Intro',sectionTitle:'Featured',hero:null,features:[{kind:'events',id:3,title:'Festival',summary:'Summary',images:[],image:null,href:'/events/3',eventDate}],sponsors:[]});
 it('fills missing dates by matching event IDs without changing the layout',()=>{
  let result:HomeView|undefined;api.publicLayout().subscribe(v=>result=v);http.expectOne(API_BASE_URL+'/v1/landing-layout').flush(view());
  const events=http.expectOne(API_BASE_URL+'/v1/events');expect(events.request.context.get(BACKGROUND_REQUEST)).toBe(true);
  events.flush([{id:3,details:{startsOn:'2026-12-20',endsOn:'2026-12-21'}}]);
  expect(result?.features[0].eventDate).toBe('2026-12-20');expect(result?.features[0].eventEndDate).toBe('2026-12-21');expect(result?.title).toBe('Udupi');
 });
 it('does not fetch events when homepage dates are already present',()=>{
  let result:HomeView|undefined;api.publicLayout().subscribe(v=>result=v);http.expectOne(API_BASE_URL+'/v1/landing-layout').flush(view('2026-12-20'));http.expectNone(API_BASE_URL+'/v1/events');expect(result?.features[0].eventDate).toBe('2026-12-20');
 });
 it('preserves homepage content when date lookup fails',()=>{
  let result:HomeView|undefined;api.publicLayout().subscribe(v=>result=v);http.expectOne(API_BASE_URL+'/v1/landing-layout').flush(view());http.expectOne(API_BASE_URL+'/v1/events').flush({}, {status:503,statusText:'Unavailable'});expect(result?.features[0].title).toBe('Festival');
 });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { AppModule } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { HomepageService, HomeView } from '../../services/homepage.service';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
 let fixture:ComponentFixture<LandingPageComponent>;
 let reads:Subject<HomeView>[];
 const custom:HomeView={configured:true,title:'The owner’s Udupi',intro:'Our choices',sectionTitle:'Favourites',hero:null,features:[],sponsors:[]};
 beforeEach(async()=>{
  reads=[];
  await TestBed.configureTestingModule({imports:[AppModule,HttpClientTestingModule,RouterTestingModule],providers:[{provide:HomepageService,useValue:{publicLayout:()=>{const read=new Subject<HomeView>();reads.push(read);return read;}}}]}).compileComponents();
  fixture=TestBed.createComponent(LandingPageComponent);fixture.detectChanges();
 });
 it('shows only a neutral loading state until the layout is known',()=>{
  expect(fixture.nativeElement.querySelector('[role=status]').textContent).toContain('Loading');
  expect(fixture.nativeElement.querySelector('.home-intro')).toBeNull();expect(fixture.nativeElement.querySelector('app-homepage-view')).toBeNull();
 });
 it('renders the custom homepage directly without the original page',()=>{
  reads[0].next(custom);reads[0].complete();fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('h1').textContent).toContain(custom.title);
  expect(fixture.nativeElement.querySelector('.home-intro')).toBeNull();expect(fixture.nativeElement.querySelector('.home-skeleton')).toBeNull();
 });
 it('renders the original homepage only after confirming no custom layout is published',()=>{
  reads[0].next({...custom,configured:false});reads[0].complete();fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('.home-intro')).not.toBeNull();expect(fixture.nativeElement.querySelector('app-homepage-view')).toBeNull();
 });
 it('offers retry on failure without showing an unconfirmed original layout',()=>{
  reads[0].error(new Error('Offline'));fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();expect(fixture.nativeElement.querySelector('.home-intro')).toBeNull();
  fixture.nativeElement.querySelector('button').click();fixture.detectChanges();
  expect(reads.length).toBe(2);reads[1].next(custom);reads[1].complete();fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('h1').textContent).toContain(custom.title);
 });
});

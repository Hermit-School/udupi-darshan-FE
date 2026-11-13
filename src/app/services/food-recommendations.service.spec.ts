import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Details } from '../models/card';
import { FoodRecommendationsService } from './food-recommendations.service';
import { API_BASE_URL } from 'src/constants/routes';
const food=(id:number,name:string,images:string[]=[]) => ({id,name,images,label:'Local food',location:'Udupi',keyPoints:[],discover:[],impInfo:[],howToVisit:null,timings:'',createdAt:'',category:'Food',descr:'Description of '+name,link:'/food/'+id,dontMissThese:[]} as Details);
const legacy={name:'Copied feature',description:'Wrong venue',imageUrl:'assets/images/h1.jpeg',link:'/woodlands-coffee'};
describe('FoodRecommendationsService', () => {
  let service:FoodRecommendationsService, http:HttpTestingController;
  beforeEach(() => {TestBed.configureTestingModule({providers:[provideHttpClient(),provideHttpClientTesting()]});service=TestBed.inject(FoodRecommendationsService);http=TestBed.inject(HttpTestingController);});
  afterEach(() => http.verify());
  const list=API_BASE_URL+'/v1/food/getFood', index=API_BASE_URL+'/v1/destination-search';
  it('replaces broken feature slugs with distinct real venues, correct photos and canonical links', () => {
    const current={...food(4,'Woodlands Restaurant'),dontMissThese:[legacy]};let result:any[]=[];
    service.forDestination(current).subscribe(items=>result=items);
    http.expectOne(list).flush([current,food(20,'Woodlands Restaurant'),food(5,'Cafe 7 Bees',['/v1/media/cafe']),food(23,'Café 7 Bees'),food(10,'Ice Cream Parlour',['assets/images/Ideal_Ice_Cream.jpg']),food(11,'Coastal Kitchen')]);
    http.expectOne(index).flush([]);
    expect(result.map(item=>item.name)).toEqual(['Cafe 7 Bees','Ice Cream Parlour','Coastal Kitchen']);
    expect(result.map(item=>item.link)).toEqual(['/details/food/5','/details/food/10','/details/food/11']);
    expect(result[0].imageUrl).toBe('/v1/media/cafe');expect(result[2].imageUrl).toBe('');
    expect(result.every(item=>!item.description.includes('Wrong venue'))).toBe(true);
  });
  it('preserves valid cross-category recommendations once the search index resolves their slug', () => {
    const current={...food(4,'Restaurant'),dontMissThese:[{...legacy,name:'Blue Lake',link:'/blue-lake',imageUrl:'assets/images/lake.jpg'}]};let result:any[]=[];
    service.forDestination(current).subscribe(items=>result=items);http.expectOne(list).flush([current,food(5,'Cafe')]);
    http.expectOne(index).flush([{id:9,name:'Blue Lake',category:'Nature',link:'/blue-lake'}]);
    expect(result).toEqual(current.dontMissThese);
  });
  it('resolves an authored venue name and shares a cached listing', () => {
    const current={...food(4,'Restaurant'),dontMissThese:[{...legacy,name:'Cafe',link:'/old-cafe-feature'}]};let result:any[]=[];
    service.forDestination(current).subscribe(items=>result=items);http.expectOne(list).flush([current,food(5,'Cafe')]);http.expectOne(index).flush([]);
    expect(result[0].link).toBe('/details/food/5');service.forDestination(current).subscribe();http.expectNone(list);http.expectNone(index);
  });
  it('does not invent destinations when loading fails, and leaves optional recommendations empty', () => {
    service.forDestination(food(4,'Restaurant')).subscribe(items=>expect(items).toEqual([]));http.expectNone(list);
    service.forDestination({...food(4,'Restaurant'),dontMissThese:[legacy]}).subscribe(items=>expect(items).toEqual([]));
    http.expectOne(index).flush([]);http.expectOne(list).flush({}, {status:503,statusText:'Unavailable'});
  });
});

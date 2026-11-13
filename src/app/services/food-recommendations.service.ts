import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, forkJoin, shareReplay, tap, timeout } from 'rxjs';
import { Details } from '../models/card';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from './background-request';
import { SharedService, matchesDestinationSlug } from './shared.service';

type Recommendation = Details['dontMissThese'][number];
const identity = (name: string) => name.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** Repair legacy feature slugs using real food records, never invented detail destinations or stock photos. */
@Injectable({providedIn: 'root'})
export class FoodRecommendationsService {
  private records: Details[] = [];
  private loadedAt = 0;
  private pending?: Observable<Details[]>;
  constructor(private http: HttpClient, private shared: SharedService) {}

  forDestination(current: Details): Observable<Recommendation[]> {
    const original = current.dontMissThese ?? [];
    const broken = (item: Recommendation) => /^\/?[^/:?#]+$/.test(item.link?.trim() ?? '') && !this.shared.relatedLink(item.link?.trim());
    if (!original.some(broken)) return of(original);
    return forkJoin({records: this.foods(), index: this.shared.loadIndex()}).pipe(map(({records}) => {
      const unique = [...new Map(records.filter(item => item && Number.isSafeInteger(item.id) && item.id > 0 && item.name?.trim())
        .sort((a,b) => b.id-a.id).map(item => [identity(item.name), item])).values()].sort((a,b) => a.id-b.id);
      const alternatives = unique.filter(item => item.id !== current.id && identity(item.name) !== identity(current.name));
      const resolved = original.flatMap(item => {
        if (!broken(item)) return [item];
        const named = alternatives.filter(food => identity(food.name) === identity(item.name));
        const matches = named.length ? named : alternatives.filter(food => matchesDestinationSlug(food, item.link!.trim().replace(/^\//, '')));
        return matches.length === 1 ? [this.card(matches[0])] : [];
      });
      if (resolved.length) return [...new Map(resolved.map(item => [item.link || identity(item.name),item])).values()];
      // Start after the current venue rather than repeating the same three cards on every food page.
      const next = alternatives.findIndex(item => item.id > current.id);
      const start = next < 0 ? 0 : next;
      return [...alternatives.slice(start), ...alternatives.slice(0,start)].slice(0,3).map(item => this.card(item));
    }));
  }
  private card(food: Details): Recommendation {
    const summary = (food.descr ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return {name: food.name, description: summary.length > 180 ? summary.slice(0,177).trimEnd()+'…' : summary,
      imageUrl: food.images?.find(image => !!image?.trim()) ?? '', link: '/details/food/'+food.id};
  }
  private foods(): Observable<Details[]> {
    if (this.pending) return this.pending;
    if (this.loadedAt && Date.now()-this.loadedAt < 60000) return of(this.records);
    const context = new HttpContext().set(BACKGROUND_REQUEST,true);
    this.pending = this.http.get<Details[]>(API_BASE_URL+'/v1/food/getFood',{context}).pipe(timeout(10000),
      map(items => Array.isArray(items) ? items : []),
      tap(items => {this.records=items; this.loadedAt=Date.now();}),
      catchError(() => of([])), finalize(() => this.pending=undefined), shareReplay({bufferSize:1,refCount:true}));
    return this.pending;
  }
}

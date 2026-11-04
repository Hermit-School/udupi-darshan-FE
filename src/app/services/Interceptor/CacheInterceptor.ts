import { BACKGROUND_REQUEST } from '../background-request';
// cache.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.context.get(BACKGROUND_REQUEST) && req.method === 'GET') return next.handle(req);
    // Only cache GET requests
    if (req.method !== 'GET' || req.headers.has('Authorization')) {
      return next.handle(req).pipe(tap(event => {
        if (event instanceof HttpResponse && req.method !== 'GET') this.cacheService.clear();
      }));
    }

    // Check for a cached response
    const cachedResponse = this.cacheService.get(req.urlWithParams);
    if (cachedResponse) {
      console.log('Returning cached response for:', req.urlWithParams);
      return of(cachedResponse);
    }

    // Make the request and cache the response
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.put(req.urlWithParams, event);
        }
      })
    );
  }
}

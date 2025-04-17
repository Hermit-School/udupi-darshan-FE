// cache.service.ts
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, HttpResponse<any>>();

  get(url: string): HttpResponse<any> | undefined {
    return this.cache.get(url);
  }

  put(url: string, response: HttpResponse<any>): void {
    this.cache.set(url, response);
  }
}
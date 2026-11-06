import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL } from 'src/constants/routes';
import { RelatedPhotosService } from './related-photos.service';

describe('RelatedPhotosService', () => {
  let service: RelatedPhotosService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({providers:[provideHttpClient(), provideHttpClientTesting()]});
    service=TestBed.inject(RelatedPhotosService);http=TestBed.inject(HttpTestingController);
  });
  afterEach(() => {http.verify();vi.useRealTimers();});
  const items=[{imageUrl:'assets/images/lake.jpg'}];
  const bundled='assets/data/advertisements.json';
  const managed=API_BASE_URL+'/v1/ads';
  it('excludes bundled, managed and legacy ad photos while preserving genuine photos', () => {
    service.prepare(items);
    expect(service.imageUrl(items[0].imageUrl)).toBeNull();
    http.expectOne(bundled).flush([{src:'assets/images/promo.jpg'}]);
    http.expectOne(managed).flush([{imageUrl:'https://cdn.example/paid/photo.png?version=1'}]);
    expect(service.imageUrl('https://udupi-darshan.firebaseapp.com/assets/images/promo.jpg?v=2')).toBeNull();
    expect(service.imageUrl('https://cdn.example/paid/photo.png?version=3')).toBeNull();
    expect(service.imageUrl('https://udupi-darshan.web.app/assets/images/%61ds2.png?v=1')).toBeNull();
    expect(service.imageUrl('assets/images/ads6.png')).toBeNull();
    expect(service.imageUrl('javascript:alert(1)')).toBeNull();
    expect(service.imageUrl(items[0].imageUrl)).toBe(items[0].imageUrl);
  });
  it('shares pending reads and skips requests when there are no related photos', () => {
    service.prepare([]);http.expectNone(bundled);http.expectNone(managed);
    service.prepare(items);service.prepare(items);
    http.expectOne(bundled).flush([]);http.expectOne(managed).flush([]);
    service.prepare(items);http.expectNone(bundled);http.expectNone(managed);
  });
  it('keeps unverified images hidden after a catalog failure and retries on the next visit', () => {
    service.prepare(items);http.expectOne(bundled).flush([]);
    http.expectOne(managed).flush({}, {status:503,statusText:'Unavailable'});
    expect(service.imageUrl(items[0].imageUrl)).toBeNull();
    service.prepare(items);http.expectOne(bundled).flush([]);http.expectOne(managed).flush([]);
    expect(service.imageUrl(items[0].imageUrl)).toBe(items[0].imageUrl);
  });
  it('refreshes the ad catalog on a later visit so new placements are excluded', () => {
    vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-05T12:00:00Z'));
    service.prepare(items);http.expectOne(bundled).flush([]);http.expectOne(managed).flush([]);
    vi.advanceTimersByTime(60001);service.prepare(items);
    http.expectOne(bundled).flush([]);http.expectOne(managed).flush([{imageUrl:items[0].imageUrl}]);
    expect(service.imageUrl(items[0].imageUrl)).toBeNull();
  });
});

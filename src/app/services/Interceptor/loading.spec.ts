import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpContext } from '@angular/common/http';
import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from '../background-request';
import { Subject } from 'rxjs';
import { MyHttpInterceptor } from './MyHttpInterceptor';
import { LoadingUtils } from '../../util/loading-util';

describe('Request loading indicator', () => {
  afterEach(() => {
    LoadingUtils.hideLoader();
  });

  it('delivers responses immediately and clears only after all requests finish', () => {
    const initialRequests = LoadingUtils.activeRequests;
    const pending = new Subject<HttpResponse<unknown>>();
    const handler = { handle: () => pending } as unknown as HttpHandler;
    const interceptor = new MyHttpInterceptor();
    let delivered = false;
    const first = interceptor.intercept(new HttpRequest('GET', '/first'), handler)
      .subscribe(() => delivered = true);
    const second = interceptor.intercept(new HttpRequest('GET', '/second'), handler).subscribe();
    expect(LoadingUtils.activeRequests).toBe(initialRequests + 2);
    pending.next(new HttpResponse({ status: 200 }));
    expect(delivered).toBe(true);
    first.unsubscribe();
    expect(LoadingUtils.activeRequests).toBe(initialRequests + 1);
    second.unsubscribe();
    expect(LoadingUtils.activeRequests).toBe(initialRequests);
  });
});


describe('Stalled content reads', () => {
 beforeEach(() => {LoadingUtils.activeRequests=0;LoadingUtils.hideLoader();});
 afterEach(() => { vi.useRealTimers();LoadingUtils.activeRequests=0;LoadingUtils.hideLoader(); });
 it.each([false,true])('times out foreground/background API reads and releases loading state (%s)', background => {
  vi.useFakeTimers();let failure:any;
  const pending=new Subject<any>();
  const req=new HttpRequest('GET',API_BASE_URL+'/v1/nature/getNature',{
   context:new HttpContext().set(BACKGROUND_REQUEST,background),
  });
  new MyHttpInterceptor().intercept(req,{handle:()=>pending}).subscribe({error:e=>failure=e});
  vi.advanceTimersByTime(30001);
  expect(failure?.name).toBe('TimeoutError');expect(LoadingUtils.activeRequests).toBe(0);
  expect(pending.observed).toBe(false);
 });
 it('does not time out or repeat a pending upload', () => {
  vi.useFakeTimers();let failure:any;let calls=0;const pending=new Subject<any>();
  const request=new HttpRequest('POST',API_BASE_URL+'/v1/admin/content/nature',{});
  const subscription=new MyHttpInterceptor().intercept(request,{handle:()=>{calls++;return pending;}}).subscribe({error:e=>failure=e});
  vi.advanceTimersByTime(60000);expect(failure).toBeUndefined();expect(calls).toBe(1);
  subscription.unsubscribe();expect(LoadingUtils.activeRequests).toBe(0);
 });
});

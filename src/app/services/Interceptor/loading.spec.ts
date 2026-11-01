import { afterEach, describe, expect, it } from 'vitest';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MyHttpInterceptor } from './MyHttpInterceptor';
import { LoadingUtils } from '../../util/loading-util';

describe('Request loading indicator', () => {
  afterEach(() => {
    LoadingUtils.activeRequests = 0;
    LoadingUtils.hideLoader();
  });

  it('delivers responses immediately and clears only after all requests finish', () => {
    const pending = new Subject<HttpResponse<unknown>>();
    const handler = { handle: () => pending } as unknown as HttpHandler;
    const interceptor = new MyHttpInterceptor();
    let delivered = false;
    const first = interceptor.intercept(new HttpRequest('GET', '/first'), handler)
      .subscribe(() => delivered = true);
    const second = interceptor.intercept(new HttpRequest('GET', '/second'), handler).subscribe();
    expect(LoadingUtils.activeRequests).toBe(2);
    pending.next(new HttpResponse({ status: 200 }));
    expect(delivered).toBe(true);
    first.unsubscribe();
    expect(LoadingUtils.activeRequests).toBe(1);
    second.unsubscribe();
    expect(LoadingUtils.activeRequests).toBe(0);
  });
});

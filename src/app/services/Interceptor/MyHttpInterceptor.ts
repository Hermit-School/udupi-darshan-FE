import { API_BASE_URL } from 'src/constants/routes';
import { BACKGROUND_REQUEST } from '../background-request';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';
import { LoadingUtils } from 'src/app/util/loading-util';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // A stalled content read must reach the page's error/retry state instead of spinning forever.
    // Writes/uploads keep their existing limits and are never retried here.
    const response = next.handle(request);
    const bounded = request.method === 'GET' && request.url.startsWith(API_BASE_URL + '/')
      ? response.pipe(timeout({ each: 30000 })) : response;
    if (request.context.get(BACKGROUND_REQUEST)) return bounded;
    if (LoadingUtils.activeRequests === 0) {
      LoadingUtils.showLoader();
    }

    LoadingUtils.incrementActiveRequests();

    return bounded.pipe(
      finalize(() => {
        LoadingUtils.decrementActiveRequests();
        if (LoadingUtils.activeRequests === 0) {
          LoadingUtils.hideLoader();
        }
      })
    );
  }
}

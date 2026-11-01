import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingUtils } from 'src/app/util/loading-util';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (LoadingUtils.activeRequests === 0) {
      LoadingUtils.showLoader();
    }

    LoadingUtils.incrementActiveRequests();

    return next.handle(request).pipe(
      finalize(() => {
        LoadingUtils.decrementActiveRequests();
        if (LoadingUtils.activeRequests === 0) {
          LoadingUtils.hideLoader();
        }
      })
    );
  }
}

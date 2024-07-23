// my-http-interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

  private activeRequests = 0;
  private loadingElement: HTMLElement | null = null;
  private readonly MIN_DISPLAY_TIME = 500; // Minimum display time in milliseconds

  private showLoader(): void {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'block';
    }
  }

  private hideLoader(): void {
    if (this.loadingElement && this.activeRequests === 0) {
      setTimeout(() => {
        if (this.activeRequests === 0) {
          this.loadingElement!.style.display = 'none';
        }
      }, this.MIN_DISPLAY_TIME);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.loadingElement = document.getElementById('loading-animation');
      this.showLoader();
    }

    this.activeRequests++;

    return next.handle(request).pipe(
      delay(this.MIN_DISPLAY_TIME),  // Ensure the request takes at least the minimum display time
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.hideLoader();
        }
      })
    );
  }
}

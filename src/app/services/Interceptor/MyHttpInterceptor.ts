import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Do something with the request here
    // request = request.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   }
    // });
    console.log("Interceptor:");

    return next.handle(request);
  }
}
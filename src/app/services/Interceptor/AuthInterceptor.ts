import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { API_BASE_URL } from 'src/constants/routes';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const api = req.url.startsWith(`${API_BASE_URL}/v1/`) || req.url.startsWith(`${API_BASE_URL}/actuator/`);
    const authEndpoint = /\/v1\/(?:login|generateOTP|verifyOTP|jwt\/generate|jwt\/validate)(?:\?|$)/.test(req.url);
    // Public reads must keep working if a session expires. Never send credentials to other hosts/assets.
    const protectedRequest = api && !authEndpoint && (req.method !== 'GET' || req.url.includes('/actuator/'));
    const token = protectedRequest ? this.auth.token : null;
    const outgoing = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next.handle(outgoing).pipe(catchError((error: HttpErrorResponse) => {
      if (protectedRequest && error.status === 401 && outgoing.headers.has('Authorization')) this.auth.expireSession();
      return throwError(() => error);
    }));
  }
}

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
    const authEndpoint = /\/v1\/(?:admin\/(?:sign-in|email\/(?:request|sign-in|reset-password))|login|generateOTP|verifyOTP|jwt\/generate|jwt\/validate)(?:\?|$)/.test(req.url);
    // Public reads must keep working if a session expires. Never send credentials to other hosts/assets.
    const publicHealth = req.method === 'GET' && /\/actuator\/health(?:[/?]|$)/.test(req.url);
    const publicSubmission = req.method === 'POST' && req.url === `${API_BASE_URL}/v1/blogs/submissions`;
    const adminRead = req.url.startsWith(`${API_BASE_URL}/v1/blogs/admin/`) || req.url.startsWith(`${API_BASE_URL}/v1/admin/`);
    const protectedRequest = api && !authEndpoint && !publicHealth && !publicSubmission && (req.method !== 'GET' || req.url.includes('/actuator/') || adminRead);
    const token = protectedRequest ? this.auth.token : null;
    const outgoing = token && !req.headers.has('Authorization') ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next.handle(outgoing).pipe(catchError((error: HttpErrorResponse) => {
      if (protectedRequest && error.status === 401 && this.auth.token
          && outgoing.headers.get('Authorization') === `Bearer ${this.auth.token}`) this.auth.expireSession();
      return throwError(() => error);
    }));
  }
}

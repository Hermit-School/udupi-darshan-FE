import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { API_BASE_URL } from 'src/constants/routes';

interface LoginUser { username: string; permission: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenValue: string | null = null;
  private expiresAt = 0;
  private admin = false;
  private expiryTimer?: ReturnType<typeof setTimeout>;
  private pendingUsername: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null {
    if (this.tokenValue && this.expiresAt <= Date.now()) this.clearSession();
    return this.tokenValue;
  }
  get isAdmin(): boolean { return !!this.token && this.admin; }

  requestOtp(username: string, password: string): Observable<string> {
    this.clearSession();
    const credentials = { userName: username, password };
    return this.http.post<LoginUser[]>(`${API_BASE_URL}/v1/login`, credentials).pipe(
      switchMap(users => {
        if (users.length !== 1 || users[0].permission?.toLowerCase() !== 'admin') {
          return throwError(() => new Error('This account does not have administrator access.'));
        }
        return this.http.post(`${API_BASE_URL}/v1/generateOTP`, credentials, { responseType: 'text' }).pipe(
          tap(() => { this.pendingUsername = users[0].username; })
        );
      })
    );
  }

  verifyOtp(otp: string): Observable<string> {
    if (!this.pendingUsername) return throwError(() => new Error('Sign in again to request a code.'));
    const username = this.pendingUsername;
    return this.http.post(`${API_BASE_URL}/v1/verifyOTP`, { username, otp }, { responseType: 'text' }).pipe(
      tap(token => {
        // This value comes only from the server's successful OTP response, never from browser storage.
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('The server returned an invalid session.');
        let claims: { sub?: string; exp?: number };
        try {
          const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const bytes = Uint8Array.from(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')), c => c.charCodeAt(0));
          claims = JSON.parse(new TextDecoder().decode(bytes));
        } catch { throw new Error('The server returned an invalid session.'); }
        if (claims.sub !== username || typeof claims.exp !== 'number' || claims.exp * 1000 <= Date.now()) {
          throw new Error('The server returned an invalid or expired session.');
        }
        this.tokenValue = token;
        this.expiresAt = claims.exp * 1000;
        this.admin = true;
        this.pendingUsername = null;
        this.expiryTimer = setTimeout(() => this.expireSession(), this.expiresAt - Date.now());
      })
    );
  }

  logout(): Observable<string> {
    const token = this.token;
    this.clearSession();
    return token ? this.http.delete(`${API_BASE_URL}/v1/jwt/revoke`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }), responseType: 'text'
    }) : of('Signed out');
  }

  clearSession(): void {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = undefined;
    this.tokenValue = null; this.expiresAt = 0; this.admin = false; this.pendingUsername = null;
  }
  expireSession(): void {
    this.clearSession();
    if (/^\/(admindashboard|new-entry)(?:[/?]|$)/.test(this.router.url)) {
      void this.router.navigate(['/admin']);
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, defer, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { API_BASE_URL } from 'src/constants/routes';

interface SessionClaims { sub: string; exp: number; iss: string; aud: string | string[]; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenValue: string | null = null;
  private expiresAt = 0;
  private admin = false;
  private expiryTimer?: ReturnType<typeof setTimeout>;
  private sessionVersion = 0;

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null {
    if (this.tokenValue && this.expiresAt <= Date.now()) this.clearSession();
    return this.tokenValue;
  }
  get isAdmin(): boolean { return !!this.token && this.admin; }

  signIn(username: string, password: string): Observable<string> {
    return this.startSession(() => this.http.post(`${API_BASE_URL}/v1/admin/sign-in`,
      { userName: username, password }, { responseType: 'text' }), username);
  }

  requestEmailCode(email: string, purpose: 'email-sign-in' | 'password-reset'): Observable<string> {
    return this.http.post(`${API_BASE_URL}/v1/admin/email/request`, { email, purpose }, { responseType: 'text' });
  }

  signInWithEmail(email: string, code: string): Observable<string> {
    return this.startSession(() => this.http.post(`${API_BASE_URL}/v1/admin/email/sign-in`,
      { email, code }, { responseType: 'text' }));
  }

  changePassword(currentPassword: string, password: string): Observable<string> {
    return this.http.post(`${API_BASE_URL}/v1/admin/password/change`, { currentPassword, password }, { responseType: 'text' })
      .pipe(map(message => { this.clearSession(); return message; }));
  }

  resetPassword(email: string, code: string, password: string): Observable<string> {
    return this.http.post(`${API_BASE_URL}/v1/admin/email/reset-password`, { email, code, password }, { responseType: 'text' })
      .pipe(map(message => { this.clearSession(); return message; }));
  }

  private startSession(request: () => Observable<string>, username?: string): Observable<string> {
    return defer(() => {
      this.clearSession();
      const version = this.sessionVersion;
      return request().pipe(switchMap(token => {
        this.requireCurrent(version);
        const claims = this.sessionClaims(token, username);
        // Only the server's admin check establishes authorization.
        return this.http.get(`${API_BASE_URL}/actuator/info`, {
          headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
        }).pipe(map(() => {
          this.requireCurrent(version);
          if (claims.exp * 1000 <= Date.now()) throw new Error('The session expired. Sign in again.');
          this.tokenValue = token;
          this.expiresAt = claims.exp * 1000;
          this.admin = true;
          if (this.expiryTimer) clearTimeout(this.expiryTimer);
          this.expiryTimer = setTimeout(() => this.expireSession(), this.expiresAt - Date.now());
          return token;
        }));
      }));
    });
  }

  private sessionClaims(token: string, username?: string): SessionClaims {
    try {
      const parts = token.split('.');
      if (parts.length !== 3 || parts.some(part => !part)) throw new Error();
      const decode = (part: string) => {
        const payload = part.replace(/-/g, '+').replace(/_/g, '/');
        const bytes = Uint8Array.from(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')), c => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
      };
      const header = decode(parts[0]);
      const claims: SessionClaims = decode(parts[1]);
      const audience = typeof claims.aud === 'string' ? [claims.aud] : claims.aud;
      if (header.alg !== 'HS256' || claims.iss !== 'udupi-darshan' || !Array.isArray(audience)
          || !audience.includes('udupi-darshan-api') || typeof claims.sub !== 'string' || !claims.sub.trim() || (username !== undefined && claims.sub !== username)
          || typeof claims.exp !== 'number' || !Number.isFinite(claims.exp)
          || claims.exp * 1000 <= Date.now() || claims.exp * 1000 - Date.now() > 2_147_483_647) throw new Error();
      return claims;
    } catch { throw new Error('The server returned an invalid or expired session. Sign in again.'); }
  }

  private requireCurrent(version: number): void {
    if (version !== this.sessionVersion) throw new Error('Sign-in was cancelled. Please sign in again.');
  }

  logout(): Observable<string> {
    const token = this.token;
    this.clearSession();
    return token ? this.http.delete(`${API_BASE_URL}/v1/jwt/revoke`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }), responseType: 'text'
    }) : of('Signed out');
  }

  clearSession(): void {
    this.sessionVersion++;
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = undefined;
    this.tokenValue = null; this.expiresAt = 0; this.admin = false;
  }
  expireSession(): void {
    this.clearSession();
    if (/^\/(admindashboard|new-entry)(?:[/?]|$)/.test(this.router.url)) {
      void this.router.navigate(['/admin']);
    }
  }
}

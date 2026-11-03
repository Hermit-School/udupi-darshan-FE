import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { AuthInterceptor } from '../services/Interceptor/AuthInterceptor';
import { AdminComponent } from '../pages/admin/admin.component';
import { adminGuard } from '../guards/admin.guard';
import { API_BASE_URL } from 'src/constants/routes';

function tokenFor(username: string, expires = Math.floor(Date.now() / 1000) + 3600, claims = {}, alg = 'HS256'): string {
  return `${btoa(JSON.stringify({ alg }))}.${btoa(JSON.stringify({ sub: username, exp: expires,
    iss: 'udupi-darshan', aud: ['udupi-darshan-api'], ...claims }))}.signature`;
}

describe('Admin authentication contract', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  let client: HttpClient;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, AdminComponent],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
    });
    auth = TestBed.inject(AuthService); http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient); router = TestBed.inject(Router);
  });
  afterEach(() => { http.verify(); auth.clearSession(); vi.useRealTimers(); });
  function requestCode(): void {
    auth.requestOtp('admin', 'test-password').subscribe();
    const login = http.expectOne(`${API_BASE_URL}/v1/login`);
    expect(login.request.method).toBe('POST');
    expect(login.request.body).toEqual({ userName: 'admin', password: 'test-password' });
    login.flush([{ username: 'admin', permission: 'admin' }]);
    const otp = http.expectOne(`${API_BASE_URL}/v1/generateOTP`);
    expect(otp.request.method).toBe('POST');
    expect(otp.request.responseType).toBe('text');
    otp.flush('Mail Sent Successfully...');
  }
  function signIn(token = tokenFor('admin')): string {
    requestCode();
    auth.verifyOtp('123456').subscribe();
    const verify = http.expectOne(`${API_BASE_URL}/v1/verifyOTP`);
    expect(verify.request.body).toEqual({ username: 'admin', otp: '123456' });
    verify.flush(token); approveAccess(token); return token;
  }
  function approveAccess(token: string): void {
    const access = http.expectOne(`${API_BASE_URL}/actuator/info`);
    expect(access.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(auth.isAdmin).toBe(false);
    access.flush({});
  }

  it('does not authenticate before server OTP verification', () => {
    requestCode(); expect(auth.isAdmin).toBe(false);
    auth.verifyOtp('123456').subscribe();
    expect(auth.isAdmin).toBe(false);
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush(tokenFor('admin'));
    approveAccess(tokenFor('admin'));
    expect(auth.isAdmin).toBe(true);
  });
  it('rejects non-admin accounts without sending an OTP', () => {
    let failed = false;
    auth.requestOtp('user', 'test-password').subscribe({ error: () => failed = true });
    http.expectOne(`${API_BASE_URL}/v1/login`).flush([{ username: 'user', permission: 'user' }]);
    http.expectNone(`${API_BASE_URL}/v1/generateOTP`);
    expect(failed).toBe(true); expect(auth.isAdmin).toBe(false);
  });
  it('keeps invalid OTPs unauthenticated and allows a retry', () => {
    requestCode(); let failed = false;
    auth.verifyOtp('000000').subscribe({ error: () => failed = true });
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush('Invalid code', { status: 401, statusText: 'Unauthorized' });
    expect(failed).toBe(true); expect(auth.isAdmin).toBe(false);
    auth.verifyOtp('123456').subscribe();
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush(tokenFor('admin'));
    approveAccess(tokenFor('admin'));
    expect(auth.isAdmin).toBe(true);
  });
  it('sends bearer tokens only on protected requests to this API', () => {
    const token = signIn();
    client.post(`${API_BASE_URL}/v1/food/postFood`, {}).subscribe();
    const write = http.expectOne(`${API_BASE_URL}/v1/food/postFood`);
    expect(write.request.headers.get('Authorization')).toBe(`Bearer ${token}`); write.flush({});
    for (const url of [`${API_BASE_URL}/v1/food/getFood`, '/assets/data/blogs.json', 'https://elsewhere.example/v1/write']) {
      client.get(url).subscribe(); const req = http.expectOne(url);
      expect(req.request.headers.has('Authorization')).toBe(false); req.flush([]);
    }
  });
  it('clears the session when a protected API request rejects the token', () => {
    signIn(); client.post(`${API_BASE_URL}/v1/food/postFood`, {}).subscribe({ error: () => {} });
    http.expectOne(`${API_BASE_URL}/v1/food/postFood`).flush('', { status: 401, statusText: 'Unauthorized' });
    expect(auth.isAdmin).toBe(false);
  });
  it('clears local credentials on logout even when server revocation fails', () => {
    const token = signIn(); auth.logout().subscribe({ error: () => {} });
    expect(auth.token).toBeNull();
    const revoke = http.expectOne(`${API_BASE_URL}/v1/jwt/revoke`);
    expect(revoke.request.method).toBe('DELETE');
    expect(revoke.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    revoke.flush('', { status: 503, statusText: 'Unavailable' });
    expect(auth.isAdmin).toBe(false);
  });
  it('expires an in-memory session without leaving a stored token', async () => {
    vi.useFakeTimers();
    requestCode(); auth.verifyOtp('123456').subscribe();
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush(tokenFor('admin', Math.floor(Date.now()/1000)+2));
    approveAccess(tokenFor('admin', Math.floor(Date.now()/1000)+2));
    expect(auth.isAdmin).toBe(true); await vi.advanceTimersByTimeAsync(2100); expect(auth.token).toBeNull();
    vi.useRealTimers();
  });
  it('guards both admin routes until a valid session exists', () => {
    const evaluate = () => TestBed.runInInjectionContext(() => adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
    expect(evaluate() instanceof UrlTree).toBe(true); signIn(); expect(evaluate()).toBe(true);
  });
  it.each([
    ['wrong subject', () => tokenFor('someone-else')],
    ['expired', () => tokenFor('admin', Math.floor(Date.now()/1000)-60)],
    ['wrong issuer', () => tokenFor('admin', undefined, { iss: 'other' })],
    ['wrong audience', () => tokenFor('admin', undefined, { aud: ['other-api'] })],
    ['missing audience', () => tokenFor('admin', undefined, { aud: null })],
    ['wrong algorithm', () => tokenFor('admin', undefined, {}, 'HS512')],
    ['invalid expiry', () => tokenFor('admin', undefined, { exp: 'tomorrow' })],
    ['malformed', () => 'not-a-jwt']
  ])('rejects a %s token without opening a session', (_, makeToken) => {
    requestCode(); let failed = false;
    auth.verifyOtp('123456').subscribe({ error: () => failed = true });
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush(makeToken());
    http.expectNone(`${API_BASE_URL}/actuator/info`);
    expect(failed).toBe(true); expect(auth.token).toBeNull();
  });
  it.each([401, 403])('requires current server admin authorization (%s)', status => {
    requestCode(); let failed = false;
    auth.verifyOtp('123456').subscribe({ error: () => failed = true });
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush(tokenFor('admin'));
    expect(auth.token).toBeNull();
    http.expectOne(`${API_BASE_URL}/actuator/info`).flush('', { status, statusText: 'Denied' });
    expect(failed).toBe(true); expect(auth.isAdmin).toBe(false);
  });
  it('does not restore a session if OTP verification finishes after sign-out', () => {
    requestCode(); let failed = false;
    auth.verifyOtp('123456').subscribe({ error: () => failed = true });
    const verify = http.expectOne(`${API_BASE_URL}/v1/verifyOTP`);
    auth.logout().subscribe(); verify.flush(tokenFor('admin'));
    http.expectNone(`${API_BASE_URL}/actuator/info`);
    expect(failed).toBe(true); expect(auth.token).toBeNull();
  });
  it('does not restore a session if the admin access check finishes after sign-out', () => {
    requestCode(); let failed = false;
    auth.verifyOtp('123456').subscribe({ error: () => failed = true });
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush(tokenFor('admin'));
    const access = http.expectOne(`${API_BASE_URL}/actuator/info`);
    auth.logout().subscribe(); access.flush({});
    expect(failed).toBe(true); expect(auth.token).toBeNull();
  });
  it('ignores an old request failure after a new sign-in', () => {
    signIn(); client.post(`${API_BASE_URL}/v1/food/postFood`, {}).subscribe({ error: () => {} });
    const previous = http.expectOne(`${API_BASE_URL}/v1/food/postFood`);
    const current = signIn(tokenFor('admin', Math.floor(Date.now()/1000)+7200));
    previous.flush('', { status: 401, statusText: 'Unauthorized' });
    expect(auth.token).toBe(current); expect(auth.isAdmin).toBe(true);
  });
  it('preserves the token being revoked if a new sign-in completes before subscription', () => {
    const previous = signIn(); const revoke$ = auth.logout();
    const current = signIn(tokenFor('admin', Math.floor(Date.now()/1000)+7200));
    revoke$.subscribe({ error: () => {} });
    const revoke = http.expectOne(`${API_BASE_URL}/v1/jwt/revoke`);
    expect(revoke.request.headers.get('Authorization')).toBe(`Bearer ${previous}`);
    revoke.flush('', { status: 401, statusText: 'Already revoked' });
    expect(auth.token).toBe(current);
  });
  it('keeps public health requests free of session credentials', () => {
    signIn(); client.get(`${API_BASE_URL}/actuator/health`).subscribe();
    const health = http.expectOne(`${API_BASE_URL}/actuator/health`);
    expect(health.request.headers.has('Authorization')).toBe(false); health.flush({ status: 'UP' });
  });
  it('shows a real error and never navigates after incorrect credentials', () => {
    const fixture = TestBed.createComponent(AdminComponent); fixture.detectChanges();
    const component = fixture.componentInstance; const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.loginForm.setValue({ username: 'admin', password: 'wrong' }); component.onSubmit();
    http.expectOne(`${API_BASE_URL}/v1/login`).flush('', { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    expect(component.phase).toBe('credentials'); expect(component.error).toContain('Incorrect');
    expect(navigate).not.toHaveBeenCalled(); expect(component.loginForm.controls.password.value).toBe('');
    fixture.destroy();
  });
  it('navigates only after password and OTP verification have both succeeded', () => {
    const fixture = TestBed.createComponent(AdminComponent); fixture.detectChanges();
    const component = fixture.componentInstance; const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.loginForm.setValue({ username: 'admin', password: 'test-password' }); component.onSubmit();
    http.expectOne(`${API_BASE_URL}/v1/login`).flush([{ username: 'admin', permission: 'ADMIN' }]);
    http.expectOne(`${API_BASE_URL}/v1/generateOTP`).flush('Mail Sent Successfully...');
    expect(component.phase).toBe('otp'); expect(navigate).not.toHaveBeenCalled();
    component.otpForm.setValue({ otp: '123456' }); component.verify();
    http.expectOne(`${API_BASE_URL}/v1/verifyOTP`).flush(tokenFor('admin'));
    expect(navigate).not.toHaveBeenCalled();
    approveAccess(tokenFor('admin'));
    expect(navigate).toHaveBeenCalledWith(['/admindashboard']); fixture.destroy();
  });
});

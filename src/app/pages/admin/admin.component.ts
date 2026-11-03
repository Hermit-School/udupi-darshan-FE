import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({ standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], selector: 'app-admin', templateUrl: './admin.component.html', styleUrls: ['./admin.component.scss'] })
export class AdminComponent implements OnDestroy {
  loginForm = this.fb.nonNullable.group({ username: ['', Validators.required], password: ['', Validators.required] });
  otpForm = this.fb.nonNullable.group({ otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]] });
  phase: 'credentials' | 'otp' = 'credentials';
  busy = false;
  error = '';
  showPassword = false;
  @ViewChild('codeInput') set codeInput(input: ElementRef<HTMLInputElement> | undefined) {
    if (input) queueMicrotask(() => {
      if (input.nativeElement.isConnected) input.nativeElement.focus();
    });
  }
  private destroyed = new Subject<void>();
  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    if (this.busy || this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.error = ''; this.busy = true;
    const { username, password } = this.loginForm.getRawValue();
    this.auth.requestOtp(username.trim(), password).pipe(takeUntil(this.destroyed), finalize(() => this.busy = false))
      .subscribe({ next: () => { this.loginForm.controls.password.reset(); this.showPassword = false; this.phase = 'otp'; },
        error: error => { this.loginForm.controls.password.reset(); this.error = this.message(error); } });
  }
  verify(): void {
    if (this.busy || this.otpForm.invalid) { this.otpForm.markAllAsTouched(); return; }
    this.error = ''; this.busy = true;
    this.auth.verifyOtp(this.otpForm.controls.otp.value).pipe(takeUntil(this.destroyed), finalize(() => this.busy = false))
      .subscribe({ next: () => { void this.router.navigate(['/admindashboard']); }, error: error => this.error = this.message(error) });
  }
  restart(): void {
    this.auth.clearSession(); this.phase = 'credentials'; this.error = ''; this.otpForm.reset();
  }
  private message(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return error instanceof Error ? error.message : 'Unable to sign in.';
    switch (error.status) {
      case 401: return this.phase === 'otp' ? 'The code is invalid, expired, or has too many attempts. Request a new code by signing in again.' : 'Incorrect username or password, or the account is temporarily locked.';
      case 403: return 'This account does not have administrator access.';
      case 429: return 'Please wait before requesting another code. Codes expire after five minutes.';
      case 502: return 'Email could not be sent. Please try again later.';
      case 0: return 'Unable to reach the server. Please check your connection and try again.';
      default: return 'Sign-in is temporarily unavailable. Please try again later.';
    }
  }
  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }
}

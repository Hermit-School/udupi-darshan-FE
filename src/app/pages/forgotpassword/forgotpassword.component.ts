import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({ standalone: false, selector: 'app-forgotpassword', templateUrl: './forgotpassword.component.html', styleUrls: ['./forgotpassword.component.scss'] })
export class ForgotpasswordComponent implements OnDestroy {
  mode: 'email-sign-in' | 'password-reset' = 'email-sign-in';
  sent = false;
  busy = false;
  message = '';
  error = '';
  resendAt = 0;
  private requests = new Subscription();
  private cooldown?: ReturnType<typeof setTimeout>;
  form;
  constructor(fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(12), (control: AbstractControl) =>
        new TextEncoder().encode(control.value || '').length > 72 ? { tooLong: true } : null]],
      confirmPassword: ['', Validators.required]
    });
  }
  get canResend(): boolean { return Date.now() >= this.resendAt; }
  choose(mode: 'email-sign-in' | 'password-reset'): void {
    if (this.busy) return;
    this.mode = mode; this.sent = false; this.message = ''; this.error = '';
    this.form.patchValue({ code: '', password: '', confirmPassword: '' });
  }
  send(): void {
    if (this.busy || !this.canResend) return;
    this.form.controls.email.markAsTouched();
    if (this.form.controls.email.invalid) return;
    this.busy = true; this.error = ''; this.message = '';
    this.requests.add(this.auth.requestEmailCode(this.form.getRawValue().email.trim(), this.mode)
      .pipe(finalize(() => this.busy = false)).subscribe({
        next: message => { this.sent = true; this.message = message; this.resendAt = Date.now() + 60000;
          if (this.cooldown) clearTimeout(this.cooldown);
          this.cooldown = setTimeout(() => this.resendAt = 0, 60000); },
        error: error => this.error = this.failure(error)
      }));
  }
  submit(): void {
    if (this.busy || !this.sent) return;
    const value = this.form.getRawValue();
    this.form.markAllAsTouched();
    if (this.form.controls.email.invalid || this.form.controls.code.invalid) return;
    if (this.mode === 'password-reset' && (this.form.controls.password.invalid || value.password !== value.confirmPassword)) return;
    this.busy = true; this.error = ''; this.message = '';
    const request = this.mode === 'email-sign-in'
      ? this.auth.signInWithEmail(value.email.trim(), value.code)
      : this.auth.resetPassword(value.email.trim(), value.code, value.password);
    this.requests.add(request.pipe(finalize(() => this.busy = false)).subscribe({
      next: () => {
        this.form.patchValue({ code: '', password: '', confirmPassword: '' });
        if (this.mode === 'email-sign-in') void this.router.navigate(['/admindashboard']);
        else { this.sent = false; this.message = 'Password updated. Return to sign in with your new password.'; }
      },
      error: error => this.error = this.failure(error)
    }));
  }
  private failure(error: { status?: number }): string {
    if (error.status === 429) return 'Too many requests. Wait a few minutes before trying again.';
    if (error.status === 401) return 'The code is incorrect, expired, or already used. Request a new code.';
    return 'Unable to complete this request. Please try again later.';
  }
  ngOnDestroy(): void { this.requests.unsubscribe(); if (this.cooldown) clearTimeout(this.cooldown); }
}

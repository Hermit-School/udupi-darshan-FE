import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';

@Component({
  standalone: true,
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink, PasswordStrengthComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['../forgotpassword/forgotpassword.component.scss']
})
export class ChangePasswordComponent implements OnDestroy {
  busy = false;
  complete = false;
  error = '';
  showPassword = false;
  private requests = new Subscription();
  form;
  constructor(fb: FormBuilder, private auth: AuthService) {
    this.form = fb.nonNullable.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(12), (control: AbstractControl) =>
        new TextEncoder().encode(control.value || '').length > 72 ? { tooLong: true } : null]],
      confirmPassword: ['', Validators.required]
    });
  }
  submit(): void {
    if (this.busy || this.complete) return;
    this.form.markAllAsTouched(); this.error = '';
    const value = this.form.getRawValue();
    if (this.form.invalid || value.password !== value.confirmPassword) return;
    if (value.password === value.currentPassword) { this.error = 'Choose a password different from your current password.'; return; }
    this.busy = true;
    this.requests.add(this.auth.changePassword(value.currentPassword, value.password)
      .pipe(finalize(() => this.busy = false)).subscribe({
        next: () => { this.form.reset(); this.complete = true; },
        error: error => this.error = error.status === 429
          ? 'Too many authentication requests. Wait before trying again.'
          : error.status === 400 ? 'Choose a different, less predictable password with at least 12 characters. Avoid common passwords, repeated patterns, or sequences.'
          : error.status === 403
          ? 'Your current password is incorrect, or password verification is temporarily locked. Try again later or use email recovery.'
          : error.status === 401 ? 'Your session expired. Sign in again before changing your password.'
          : 'Unable to change your password. Please try again later.'
      }));
  }
  ngOnDestroy(): void { this.requests.unsubscribe(); }
}

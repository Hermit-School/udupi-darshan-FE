import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({ standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], selector: 'app-admin', templateUrl: './admin.component.html', styleUrls: ['./admin.component.scss'] })
export class AdminComponent implements OnDestroy {
  loginForm = this.fb.nonNullable.group({ username: ['', Validators.required], password: ['', Validators.required] });
  busy = false;
  error = '';
  showPassword = false;
  private destroyed = new Subject<void>();
  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private route: ActivatedRoute) {}

  get accessRequired(): boolean { return this.route.snapshot.queryParamMap.get('access') === 'required'; }

  onSubmit(): void {
    if (this.busy || this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.error = ''; this.busy = true;
    const { username, password } = this.loginForm.getRawValue();
    this.auth.signIn(username.trim(), password).pipe(takeUntil(this.destroyed), finalize(() => this.busy = false))
      .subscribe({
        next: () => { this.loginForm.controls.password.reset(); void this.router.navigate(['/admindashboard']); },
        error: error => { this.loginForm.controls.password.reset(); this.showPassword = false; this.error = this.message(error); }
      });
  }
  private message(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return error instanceof Error ? error.message : 'Unable to sign in.';
    switch (error.status) {
      case 401: return 'Incorrect username or password, or the account is temporarily locked.';
      case 429: return 'Too many sign-in requests. Wait before trying again.';
      case 403: return 'This account does not have administrator access.';
      case 0: return 'Unable to reach the server. Please check your connection and try again.';
      default: return 'Sign-in is temporarily unavailable. Please try again later.';
    }
  }
  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }
}

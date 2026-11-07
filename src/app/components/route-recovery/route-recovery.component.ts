import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationError, NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** A failed lazy page download must not leave a navigation click silently ignored. */
@Component({
  selector: 'app-route-recovery',
  standalone: true,
  template: `@if (failedUrl()) {
    <aside role="alert" class="route-recovery">
      <strong>Unable to open this page.</strong>
      <p>Check your connection, then reload to continue to the page you selected.</p>
      @if (hasForm()) { <p>Reloading will discard any unsaved changes on this page.</p> }
      <button type="button" (click)="reload()">Reload page</button>
    </aside>
  }`,
  styles: [`
    .route-recovery { position:fixed; z-index:1200; bottom:1rem; left:50%; transform:translateX(-50%);
      width:min(34rem,calc(100% - 2rem)); padding:1.25rem; border:1px solid #e6c7ac; border-radius:1rem;
      background:#fffaf5; color:#38261c; box-shadow:0 8px 28px #22283126; }
    p { margin:.5rem 0; } button { background:#222831; color:#fff; border:0; border-radius:2rem;
      padding:.7rem 1.2rem; min-height:44px; font:inherit; cursor:pointer; }
    button:focus-visible { outline:3px solid #ff6000; outline-offset:3px; }
  `],
})
export class RouteRecoveryComponent {
  readonly failedUrl = signal('');
  readonly hasForm = signal(false);
  constructor() {
    inject(Router).events.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(event => {
      if (event instanceof NavigationStart) this.failedUrl.set('');
      if (event instanceof NavigationError) {
        this.hasForm.set(!!document.querySelector('form'));
        this.failedUrl.set(event.url);
      }
    });
  }
  reload(): void {
    const url = this.failedUrl();
    if (!url) return;
    // Keep hash-based routing and the requested destination across the full reload.
    // This is explicit, so an editor never loses a draft through an automatic refresh.
    history.replaceState(history.state, '', location.pathname + location.search + '#' + url);
    location.reload();
  }
}

import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NavigationCancel, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RouteRecoveryComponent } from './route-recovery.component';

describe('Navigation recovery', () => {
 const events = new Subject<any>();
 beforeEach(async () => {
  await TestBed.configureTestingModule({imports:[RouteRecoveryComponent],providers:[{provide:Router,useValue:{events}}]}).compileComponents();
 });
 it('reports a failed page load without replacing the page and clears on the next navigation', () => {
  const fixture=TestBed.createComponent(RouteRecoveryComponent);fixture.detectChanges();
  events.next(new NavigationError(1,'/culture',new Error('Failed to fetch dynamically imported module')));fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Unable to open this page');
  expect(fixture.componentInstance.failedUrl()).toBe('/culture');
  events.next(new NavigationStart(2,'/nature'));fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();fixture.destroy();
 });
 it('does not treat a canceled navigation as a failed download', () => {
  const fixture=TestBed.createComponent(RouteRecoveryComponent);fixture.detectChanges();
  events.next(new NavigationCancel(1,'/admin','Guard redirected'));fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();fixture.destroy();
 });
});

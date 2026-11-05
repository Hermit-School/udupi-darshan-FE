import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AppModule } from "src/app/app.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  NavigationError,
  NavigationCancel,
  Router,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
} from "@angular/router";
import { Subject } from "rxjs";
import { LoadingComponent } from "./loading.component";
import { LoadingUtils } from "../../util/loading-util";
describe("LoadingComponent", () => {
  let fixture: ComponentFixture<LoadingComponent>;
  let events: Subject<any>;
  beforeEach(async () => {
    events = new Subject();
    LoadingUtils.activeRequests = 0;
    LoadingUtils.hideLoader();
    await TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: Router, useValue: { events } }],
    }).compileComponents();
    fixture = TestBed.createComponent(LoadingComponent);
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
    LoadingUtils.activeRequests = 0;
    LoadingUtils.hideLoader();
  });
  it("creates the branded indicator", () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".loading-logo")).toBeTruthy();
  });
  it("clears failed lazy route loads without losing an active HTTP request", () => {
    const route = { path: "events" };
    LoadingUtils.incrementActiveRequests();
    events.next(new RouteConfigLoadStart(route));
    expect(LoadingUtils.activeRequests).toBe(2);
    events.next(new NavigationError(1, "/events", new Error("Chunk failed")));
    expect(LoadingUtils.activeRequests).toBe(1);
    events.next(new RouteConfigLoadEnd(route));
    expect(LoadingUtils.activeRequests).toBe(1);
  });
  it("clears canceled navigation and ignores its late route completion", () => {
    const route = { path: "events" };
    events.next(new RouteConfigLoadStart(route));
    events.next(new NavigationCancel(1, "/events", "Canceled"));
    expect(LoadingUtils.activeRequests).toBe(0);
    events.next(new RouteConfigLoadEnd(route));
    expect(LoadingUtils.activeRequests).toBe(0);
  });
});

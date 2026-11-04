import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppModule } from "./app.module";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  });

  it("renders the navigation, route outlet and footer", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.hidePublicChrome = false;
    fixture.detectChanges();
    const rendered = fixture.nativeElement as HTMLElement;
    expect(rendered.querySelector("app-navbar")).not.toBeNull();
    expect(rendered.querySelector("router-outlet")).not.toBeNull();
    expect(rendered.querySelector("app-footer")).not.toBeNull();
    fixture.destroy();
  });
});

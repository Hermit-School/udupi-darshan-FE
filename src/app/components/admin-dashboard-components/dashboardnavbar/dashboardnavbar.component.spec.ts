import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppModule } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardnavbarComponent } from './dashboardnavbar.component';

describe('DashboardnavbarComponent', () => {
  let component: DashboardnavbarComponent;
  let fixture: ComponentFixture<DashboardnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule, RouterTestingModule],

    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

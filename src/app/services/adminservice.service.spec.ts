import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppModule } from 'src/app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { AdminserviceService } from './adminservice.service';

describe('AdminserviceService', () => {
  let service: AdminserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule, RouterTestingModule],});
    service = TestBed.inject(AdminserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

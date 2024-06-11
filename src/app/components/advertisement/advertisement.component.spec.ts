// file changes made by rashmi on 10-06-2024
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementComponent } from './advertisement.component';

describe('AdvertisementComponent', () => {
  let component: AdvertisementComponent;
  let fixture: ComponentFixture<AdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertisementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
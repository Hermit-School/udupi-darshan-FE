import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollableNavbarComponent } from './scrollable-navbar.component';

describe('ScrollableNavbarComponent', () => {
  let component: ScrollableNavbarComponent;
  let fixture: ComponentFixture<ScrollableNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollableNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollableNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

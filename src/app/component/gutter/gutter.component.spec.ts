import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GutterComponent } from './gutter.component';

describe('GutterComponent', () => {
  let component: GutterComponent;
  let fixture: ComponentFixture<GutterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GutterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GutterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

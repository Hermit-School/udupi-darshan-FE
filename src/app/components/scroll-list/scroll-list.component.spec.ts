// file changes made by rashmi on 10-06-2024
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollListComponent } from './scroll-list.component';

describe('BlogsComponent', () => {
  let component: ScrollListComponent;
  let fixture: ComponentFixture<ScrollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrollListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScrollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
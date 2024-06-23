import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardrequesttableComponent } from './dashboardrequesttable.component';

describe('DashboardrequesttableComponent', () => {
  let component: DashboardrequesttableComponent;
  let fixture: ComponentFixture<DashboardrequesttableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardrequesttableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardrequesttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

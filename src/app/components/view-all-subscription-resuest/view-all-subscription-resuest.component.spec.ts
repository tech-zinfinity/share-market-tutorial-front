import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllSubscriptionResuestComponent } from './view-all-subscription-resuest.component';

describe('ViewAllSubscriptionResuestComponent', () => {
  let component: ViewAllSubscriptionResuestComponent;
  let fixture: ComponentFixture<ViewAllSubscriptionResuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllSubscriptionResuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllSubscriptionResuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeCourseComponent } from './subscribe-course.component';

describe('SubscribeCourseComponent', () => {
  let component: SubscribeCourseComponent;
  let fixture: ComponentFixture<SubscribeCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseDetailComponent } from './view-course-detail.component';

describe('ViewCourseDetailComponent', () => {
  let component: ViewCourseDetailComponent;
  let fixture: ComponentFixture<ViewCourseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCourseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

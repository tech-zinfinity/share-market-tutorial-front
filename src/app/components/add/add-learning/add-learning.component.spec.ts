import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLearningComponent } from './add-learning.component';

describe('AddLearningComponent', () => {
  let component: AddLearningComponent;
  let fixture: ComponentFixture<AddLearningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLearningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

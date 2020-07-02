import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialBottomsheetComponent } from './social-bottomsheet.component';

describe('SocialBottomsheetComponent', () => {
  let component: SocialBottomsheetComponent;
  let fixture: ComponentFixture<SocialBottomsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialBottomsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialBottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSamplePageComponent } from './form-sample-page.component';

describe('FormSamplePageComponent', () => {
  let component: FormSamplePageComponent;
  let fixture: ComponentFixture<FormSamplePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSamplePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSamplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

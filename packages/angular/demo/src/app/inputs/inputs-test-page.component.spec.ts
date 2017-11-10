import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsTestPageComponent } from './inputs-test-page.component';

describe('InputsTestPageComponent', () => {
  let component: InputsTestPageComponent;
  let fixture: ComponentFixture<InputsTestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsTestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

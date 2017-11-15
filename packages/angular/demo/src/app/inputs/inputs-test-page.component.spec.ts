import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputsTestPageComponent } from './inputs-test-page.component';

describe('InputsTestPageComponent', () => {
  let component: InputsTestPageComponent;
  let fixture: ComponentFixture<InputsTestPageComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [InputsTestPageComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('testInputOne', () => {
    let input;
    beforeEach(
      fakeAsync(() => {
        component.ngOnInit();
        fixture.detectChanges();
        tick();
        const ionInput = fixture.debugElement.query(By.css('#inputOne'));
        input = ionInput.query(By.css('input')).nativeElement;
      })
    );

    it('should reflect changes to the input', () => {
      expect(input).toBeTruthy();
    });
  });
});

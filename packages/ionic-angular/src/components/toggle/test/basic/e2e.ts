import { by, element } from 'protractor';

it('should check apple via switch element click', function() {
  element(by.css('[formControlName="apple"]')).click();
});


it('should enable/check grape via buttons and submit form', function() {
  element(by.css('.e2eGrapeDisabled')).click();
  element(by.css('.e2eGrapeChecked')).click();
  element(by.css('.e2eSubmit')).click();
});

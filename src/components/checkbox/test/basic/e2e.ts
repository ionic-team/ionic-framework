import { by, element } from 'protractor';

it('should check apple, enable/check grape, submit form', function() {
  element(by.css('[formControlName=apple]')).click();
  element(by.css('.e2eGrapeDisabled')).click();
  element(by.css('.e2eGrapeChecked')).click();
  element(by.css('.e2eSubmit')).click();
});

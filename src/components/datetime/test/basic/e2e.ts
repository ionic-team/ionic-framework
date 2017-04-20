import { by, element } from 'protractor';

it('should open basic datetime picker', function() {
  element(by.css('.e2eOpenMMDDYYYY')).click();
});

it('should close with Done button click', function() {
  element(by.css('.picker-toolbar-button:last-child .button')).click();
});

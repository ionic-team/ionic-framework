import { by, element } from 'protractor';

it('should open default spinner', function() {
  element(by.css('.e2eLoadingDefaultSpinner')).click();
});

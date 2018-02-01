import { by, element } from 'protractor';

it('should disable all inputs', function() {
  element(by.css('.e2eDisableButton')).click();
});

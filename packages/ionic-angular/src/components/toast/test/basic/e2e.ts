import { by, element } from 'protractor';

it('should open toast', function() {
  element(by.css('.e2eOpenToast')).click();
});

import { by, element } from 'protractor';

it('should open gender single select', function() {
  element(by.css('.e2eSelectGender button')).click();
});

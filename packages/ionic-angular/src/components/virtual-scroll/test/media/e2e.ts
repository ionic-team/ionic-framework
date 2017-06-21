import { by, element } from 'protractor';

it('should check the first checkbox, toggle, and radio', function() {
  element(by.css('.item-0 .checkbox')).click();
  element(by.css('.item-2 .toggle')).click();
  element(by.css('.item-4 .radio')).click();
});

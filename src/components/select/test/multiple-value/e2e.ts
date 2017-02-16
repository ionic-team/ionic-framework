import { by, element } from 'protractor';

it('should open toppings multiple select', function() {
  element(by.css('.e2eSelectToppings button')).click();
});

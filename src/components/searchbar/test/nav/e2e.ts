import { by, element } from 'protractor';

it('should navigate to details', function() {
  element(by.css('.e2eSearchbarNavItem:first-child')).click();
});

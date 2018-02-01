import { by, element } from 'protractor';

it('should open list popover', function() {
  element(by.css('.e2eOpenListPopover')).click();
});

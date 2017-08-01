import { by, element } from 'protractor';

it('should click edit button', function() {
  element(by.css('.e2eButtonEdit')).click();
});

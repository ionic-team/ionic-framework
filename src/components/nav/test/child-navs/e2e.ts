import { by, element } from 'protractor';

it('should go to nested children', function() {
  element(by.css('.e2eChildNavsNested')).click();
});

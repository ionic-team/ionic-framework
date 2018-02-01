import { by, element } from 'protractor';

it('should show default spinner', function() {
  element(by.css('.e2eLoadingTabsContent')).click();
});

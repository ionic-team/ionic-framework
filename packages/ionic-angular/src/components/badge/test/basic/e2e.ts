import { by, element } from 'protractor';

it('should toggle color', function() {
  element(by.css('.e2eBadgeToggleColor')).click();
});

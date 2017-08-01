import { by, element } from 'protractor';

it('should check Cherry', function() {
  element(by.css('[value="cherry"] button')).click();
});

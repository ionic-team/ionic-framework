import { by, element } from 'protractor';

it('should open default spinner', function() {
  element(by.css('.e2eLoadingDefaultSpinner')).click();
});

it('should open custom loading component', function() {
  element(by.css('.e2eLoadingCustomComponent')).click().then(() => {
    const el = element(by.css('.loading-custom-text'));
    expect(el).toBeDefined();
  });
});

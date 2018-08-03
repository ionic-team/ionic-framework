import { browser, by, element, protractor } from 'protractor';

it('should open gender single select', function() {
  element(by.css('.e2eSelectGender button')).click();
});

it('should select a false value and close', function() {
  // Open the boolean alert
  element(by.css('.e2eSelectBoolean button')).click();
  // Click on the "false" value
  element(by.css('#alert-input-0-1')).click();
  // Click OK
  element.all(by.css('.alert-button-group .alert-button')).last().click();

  browser.wait(
    protractor.ExpectedConditions.stalenessOf(
      element(by.css('.select-alert'))
    ), 500
  );
});

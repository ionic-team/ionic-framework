import { by, element } from 'protractor';

it('should go to Tab1 Page1', function() {
  element(by.css('.e2eSignIn')).click();
});

it('should go to Tab1 Page2', function() {
  element(by.css('.e2eGoToTab1Page2')).click();
});

it('should go back to Tab1 Page1', function() {
  element(by.css('.e2eBackToTab1Page1')).click();
});

it('should go to Tab2 Page1', function() {
  element(by.css('.tab-button:nth-of-type(2)')).click();
});

it('should go back to Tab1 Page1', function() {
  element(by.css('.tab-button:nth-of-type(1)')).click();
});

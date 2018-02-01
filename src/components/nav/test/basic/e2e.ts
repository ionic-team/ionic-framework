import { by, element } from 'protractor';

it('should go from 1 to 2', function() {
  element(by.css('.e2eFrom1To2')).click();
});

it('should go from 2 to 3', function() {
  element(by.css('.e2eFrom2To3')).click();
});

it('should go from 3 to 2', function() {
  element(by.css('.e2eFrom3To2')).click();
});

it('should go from 2 to 1', function() {
  element(by.css('.e2eFrom2To1')).click();
});

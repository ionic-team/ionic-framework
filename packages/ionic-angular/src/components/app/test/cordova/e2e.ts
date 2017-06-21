import { by, element } from 'protractor';

it('should navigate to page 2', function() {
  element(by.css('.e2eCordovaPage2')).click();
});

it('should navigate to page 3', function() {
  element(by.css('.e2eCordovaPage3')).click();
});

it('should navigate back', function() {
  element(by.css('.e2eCordovaGoBack')).click();
});

it('should open modal', function() {
  element(by.css('.e2eCordovaOpenModal')).click();
});

it('should close modal', function() {
  element(by.css('.e2eCordovaCloseModal')).click();
});

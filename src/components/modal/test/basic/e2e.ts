import { by, element } from 'protractor';

it('should open modal', function() {
  element(by.css('.e2eOpenModal')).click();
});

it('should close alert with button click', function() {
  element(by.css('.alert-button')).click();
});

it('should close with close button click', function() {
  element(by.css('.e2eCloseMenu')).click();
});

it('should open toolbar modal', function() {
  element(by.css('.e2eOpenToolbarModal')).click();
});

it('should close alert with button click', function() {
  element(by.css('.alert-button')).click();
});

it('should close toolbar modal', function() {
  element(by.css('.e2eCloseToolbarModal')).click();
});

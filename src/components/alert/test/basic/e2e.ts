import { by, element } from 'protractor';

it('should open basic alert', function() {
  element(by.css('.e2eOpenAlert')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open alert long message', function() {
  element(by.css('.e2eOpenAlertLongMessage')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open alert multiple buttons', function() {
  element(by.css('.e2eOpenMultipleButtons')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open alert no message', function() {
  element(by.css('.e2eOpenAlertNoMessage')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open confirm alert', function() {
  element(by.css('.e2eOpenConfirm')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open prompt alert', function() {
  element(by.css('.e2eOpenPrompt')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open radio alert', function() {
  element(by.css('.e2eOpenRadio')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open checkbox alert', function() {
  element(by.css('.e2eOpenCheckbox')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open and close fast close alert', function() {
  element(by.css('.e2eFastClose')).click();
});

it('should open disabled backdrop alert', function() {
  element(by.css('.e2eDisabledBackdrop')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

it('should open alert with mode', function() {
  element(by.css('.e2eAlertMode')).click();
});

it('should close with button click', function() {
  element(by.css('.alert-button:last-child')).click();
});

import { by, element } from 'protractor';

it('should toggle left menu', function() {
  element(by.css('.e2eContentToggleLeftMenu')).click();
});


it('should close left menu', function() {
  element(by.css('.e2eCloseLeftMenu')).click();
});

it('should toggle right menu', function() {
  element(by.css('.e2eContentToggleRightMenu')).click();
});


it('should close right menu', function() {
  element(by.css('.e2eCloseRightMenu')).click();
});

import { by, element } from 'protractor';

it('should toggle start menu', function() {
  element(by.css('.e2eContentToggleStartMenu')).click();
});


it('should close start menu', function() {
  element(by.css('.e2eCloseStartMenu')).click();
});

it('should toggle end menu', function() {
  element(by.css('.e2eContentToggleEndMenu')).click();
});


it('should close end menu', function() {
  element(by.css('.e2eCloseEndMenu')).click();
});

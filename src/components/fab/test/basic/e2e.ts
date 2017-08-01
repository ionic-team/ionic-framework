import { by, element } from 'protractor';

it('should open fab lists ', function() {
  element(by.css('.e2eFabTopRight')).click();
  element(by.css('.e2eFabBottomRight')).click();
  element(by.css('.e2eFabTopLeft')).click();
  element(by.css('.e2eFabBottomLeft')).click();
  element(by.css('.e2eFabCenter')).click();
});

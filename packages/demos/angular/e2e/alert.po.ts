import { browser, by, element } from 'protractor';

export class AlertPage {
  navigateTo() {
    return browser.get('/alert');
  }

  getButton() {
    return element(by.css('ion-button'));
  }

  getAlert() {
    return element(by.css('ion-alert'));
  }

  getCloseButton() {
    return element(by.css('.alert-button'));
  }
}

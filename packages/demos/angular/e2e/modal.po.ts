import { browser, by, element } from 'protractor';

export class ModalPage {
  navigateTo() {
    return browser.get('/modal');
  }

  getButton() {
    return element(by.css('ion-button'));
  }

  getModal() {
    return element(by.css('page-one'));
  }

  getDismissButton() {
    return element(by.css('button.dismiss-btn'));
  }

}

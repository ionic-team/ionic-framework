import { browser, by, element } from 'protractor';

export class LoadingPage {
  navigateTo() {
    return browser.get('/loading');
  }

  getButton() {
    return element(by.css('ion-button'));
  }

  getLoading() {
    return element(by.css('ion-loading'));
  }

}

import { browser, by, element } from 'protractor';

export class InputsPage {
  navigateTo() {
    return browser.get('/inputs');
  }

  getTitleText() {
    return element(by.css('.title')).getText();
  }

  getInputOne() {
    return element(by.id('inputOne'));
  }

  getOutputOneText() {
    return element(by.id('outputOne')).getText();
  }
}

import { browser, by, element } from 'protractor';

export class InputsPage {
  navigateTo() {
    return browser.get('/inputs');
  }

  getTitle() {
    return element(by.css('.title')).getText();
  }
}

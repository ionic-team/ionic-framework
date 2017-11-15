import { browser, by, element } from 'protractor';

export class HomePage {
  navigateTo() {
    return browser.get('/home');
  }

  navigateToRoot() {
    return browser.get('/');
  }

  getTitle() {
    return element(by.css('.title')).getText();
  }
}

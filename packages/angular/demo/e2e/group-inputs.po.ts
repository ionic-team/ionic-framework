import { browser, by, element } from 'protractor';

export class GroupInputsPage {
  navigateTo() {
    return browser.get('/group-inputs');
  }

  getIonicCheckbox() {
    return element(by.id('ionCheckbox'));
  }

  getCheckboxOutput() {
    return element(by.id('checkboxOutput')).getText();
  }

  getTitleText() {
    return element(by.css('.title')).getText();
  }
}

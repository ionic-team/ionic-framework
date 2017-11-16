import { browser, by, element } from 'protractor';

export class InputsPage {
  navigateTo() {
    return browser.get('/inputs');
  }

  getTitleText() {
    return element(by.css('.title')).getText();
  }

  getIonicTextInput() {
    return element(by.id('ionTextInput'));
  }

  getIonicTextInputOutputText() {
    return element(by.id('ionTextInputOutput')).getText();
  }

  getIonicCheckbox() {
    return element(by.id('ionCheckbox'));
  }

  getIonicCheckboxOutputText() {
    return element(by.id('ionCheckboxOutput')).getText();
  }
}

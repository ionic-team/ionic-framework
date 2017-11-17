import { browser, by, element } from 'protractor';

export class InputsPage {
  navigateTo() {
    return browser.get('/inputs');
  }

  getIonicCheckbox() {
    return element(by.id('ionCheckbox'));
  }

  getCheckboxOutput() {
    return element(by.id('checkboxOutput')).getText();
  }

  getIonicToggle() {
    return element(by.id('ionToggle'));
  }

  getToggleOutput() {
    return element(by.id('toggleOutput')).getText();
  }

  getTitleText() {
    return element(by.css('.title')).getText();
  }

  getIonicTextareaInput() {
    return element(by.id('ionTextareaInput'));
  }

  getIonicTextareaInputEditable() {
    const parent = this.getIonicTextareaInput();
    return parent.all(by.css('textarea')).first();
  }

  getTextareaOutput() {
    return element(by.id('textareaOutput')).getText();
  }

  getIonicTextInput() {
    return element(by.id('ionTextInput'));
  }

  getIonicTextInputEditable() {
    const parent = this.getIonicTextInput();
    return parent.all(by.css('input')).first();
  }

  getTextOutput() {
    return element(by.id('textOutput')).getText();
  }
}

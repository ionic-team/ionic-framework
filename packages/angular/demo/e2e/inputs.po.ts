import { browser, by, element } from 'protractor';

export class InputsPage {
  navigateTo() {
    return browser.get('/inputs');
  }

  getIonicCheckbox() {
    return element(by.id('ionCheckbox'));
  }

  getIonicCheckboxOutputText() {
    return element(by.id('ionCheckboxOutput')).getText();
  }

  getIonicToggle() {
    return element(by.id('ionToggle'));
  }

  getIonicToggleOutputText() {
    return element(by.id('ionToggleOutput')).getText();
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

  getIonicTextareaInputOutputText() {
    return element(by.id('ionTextareaInputOutput')).getText();
  }

  getIonicTextInput() {
    return element(by.id('ionTextInput'));
  }

  getIonicTextInputEditable() {
    const parent = this.getIonicTextInput();
    return parent.all(by.css('input')).first();
  }

  getIonicTextInputOutputText() {
    return element(by.id('ionTextInputOutput')).getText();
  }
}

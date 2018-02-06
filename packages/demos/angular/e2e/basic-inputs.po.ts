import { browser, by, element } from 'protractor';

export class BasicInputsPage {
  navigateTo() {
    return browser.get('/basic-inputs');
  }

  getIonicCheckbox() {
    return element(by.id('ionCheckbox'));
  }

  getCheckboxOutput() {
    return element(by.id('checkboxOutput')).getText();
  }

  getIonicDatetime() {
    return element(by.id('ionDatetimeInput'));
  }

  getDatetimeOutput() {
    return element(by.id('datetimeOutput')).getText();
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

  getIonicSearchInput() {
    return element(by.id('ionSearchInput'));
  }

  getIonicSearchInputEditable() {
    const parent = this.getIonicSearchInput();
    return parent.all(by.css('input')).first();
  }

  getSearchOutput() {
    return element(by.id('searchOutput')).getText();
  }

  getIonicTextInput() {
    return element(by.id('ionTextInput'));
  }

  getIonicTextInputEditable() {
    const parent = this.getIonicTextInput();
    return parent.all(by.css('input')).first();
  }

  getIonicNumericInput() {
    return element(by.id('ionNumericInput'));
  }

  getIonicNumericInputEditable() {
    const parent = this.getIonicNumericInput();
    return parent.all(by.css('input')).first();
  }

  getTextOutput() {
    return element(by.id('textOutput')).getText();
  }

  getNumericOutputType() {
    return element(by.id('numericOutputType')).getText();
  }

  getDisableButton() {
    return element(by.id('disableCheckbox'));
  }
}

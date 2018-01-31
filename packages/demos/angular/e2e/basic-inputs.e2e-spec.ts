import { browser, ElementFinder } from 'protractor/built';

import { BasicInputsPage } from './basic-inputs.po';

describe('Basic Inputs Page', () => {
  let page: BasicInputsPage;

  beforeEach(() => {
    page = new BasicInputsPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Ionic Core Basic Inputs Demo');
  });

  describe('text input', () => {
    it('should display the starting text', () => {
      page.navigateTo();
      const el = page.getIonicTextInput();
      expect(el.getAttribute('value')).toEqual('This is the Text Input');
    });

    it('should reflect back the entered data', () => {
      page.navigateTo();
      const el = page.getIonicTextInputEditable();
      el.clear();
      el.sendKeys('I am new text');
      expect(page.getTextOutput()).toEqual('I am new text');
    });

    it('should trigger validation errors', () => {
      page.navigateTo();
      const el = page.getIonicTextInput();
      const inp = page.getIonicTextInputEditable();
      expect(hasClass(el, 'ng-invalid')).toEqual(false);
      inp.clear();
      inp.sendKeys('ninechars');
      expect(hasClass(el, 'ng-invalid')).toEqual(true);
      inp.sendKeys('X');
      expect(hasClass(el, 'ng-invalid')).toEqual(false);
    });
  });

  describe('numeric input', () => {
    it('should remain type number with modifications', () => {
      page.navigateTo();
      const el = page.getIonicNumericInput();
      const inp = page.getIonicNumericInputEditable();
      expect(page.getNumericOutputType()).toEqual('number');
      inp.sendKeys('318');
      expect(page.getNumericOutputType()).toEqual('number');
      inp.clear();
      inp.sendKeys('-0');
      expect(page.getNumericOutputType()).toEqual('number');
      inp.sendKeys('.48859');
      expect(page.getNumericOutputType()).toEqual('number');
    });
  });

  describe('textarea input', () => {
    it('should display the starting text', () => {
      page.navigateTo();
      const el = page.getIonicTextareaInput();
      expect(el.getAttribute('value')).toEqual('This is the Textarea Input');
    });

    it('should reflect back the entered data', () => {
      page.navigateTo();
      const el = page.getIonicTextareaInputEditable();
      el.clear();
      el.sendKeys('I am new text');
      expect(page.getTextareaOutput()).toEqual('I am new text');
    });

    it('should trigger validation errors', () => {
      page.navigateTo();
      const el = page.getIonicTextareaInput();
      const inp = page.getIonicTextareaInputEditable();
      expect(hasClass(el, 'ng-invalid')).toEqual(false);
      inp.clear();
      inp.sendKeys('ninechars');
      expect(hasClass(el, 'ng-invalid')).toEqual(true);
      inp.sendKeys('X');
      expect(hasClass(el, 'ng-invalid')).toEqual(false);
    });
  });

  describe('checkbox input', () => {
    it('should be set the initial value', () => {
      page.navigateTo();
      const el = page.getIonicCheckbox();
      expect(el.getAttribute('checked')).toEqual('true');
    });

    it('should reflect toggling the value', () => {
      page.navigateTo();
      return browser.executeScript('window.scrollTo(0, 500);').then(function() {
        const el = page.getIonicCheckbox();
        el.click();
        expect(page.getCheckboxOutput()).toEqual('false');
      });
    });
  });

  describe('toggle input', () => {
    it('should be set the initial value', () => {
      page.navigateTo();
      const el = page.getIonicToggle();
      expect(el.getAttribute('checked')).toBeNull();
    });

    it('should reflect toggling the value', () => {
      page.navigateTo();
      return browser.executeScript('window.scrollTo(0, 500);').then(function() {
        const el = page.getIonicToggle();
        el.click();
        expect(page.getToggleOutput()).toEqual('true');
      });
    });
  });

  describe('date time picker', () => {
    it('should be set the initial value', () => {
      page.navigateTo();
      const el = page.getIonicDatetime();
      expect(el.getAttribute('value')).toEqual('2017-11-18T14:17:45-06:00');
    });
  });

  async function hasClass(el: ElementFinder, cls: string): Promise<boolean> {
    const classes = await el.getAttribute('class');
    return classes.split(' ').indexOf(cls) !== -1;
  }
});

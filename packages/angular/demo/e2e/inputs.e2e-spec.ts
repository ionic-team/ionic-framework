import { ElementFinder, promise } from 'protractor/built';

import { InputsPage } from './inputs.po';

describe('Demo Inputs Page', () => {
  let page: InputsPage;

  beforeEach(() => {
    page = new InputsPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Ionic Core Inputs Demo');
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
      const el = page.getIonicCheckbox();
      el.click();
      expect(page.getCheckboxOutput()).toEqual('false');
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
      const el = page.getIonicToggle();
      el.click();
      expect(page.getToggleOutput()).toEqual('true');
    });
  });

  async function hasClass(el: ElementFinder, cls: string): Promise<boolean> {
    const classes = await el.getAttribute('class');
    return classes.split(' ').indexOf(cls) !== -1;
  }
});

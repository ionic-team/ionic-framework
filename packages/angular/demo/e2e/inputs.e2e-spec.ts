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
      expect(el.getAttribute('value')).toEqual('This is the Ionic Text Input');
    });

    it('should reflect back the entered data', () => {
      page.navigateTo();
      const el = page.getIonicTextInputEditable();
      el.clear();
      el.sendKeys('I am new text');
      expect(page.getIonicTextInputOutputText()).toEqual('I am new text');
    });
  });

  describe('textarea input', () => {
    it('should display the starting text', () => {
      page.navigateTo();
      const el = page.getIonicTextareaInput();
      expect(el.getAttribute('value')).toEqual('This is the Ionic Textarea Input');
    });

    it('should reflect back the entered data', () => {
      page.navigateTo();
      const el = page.getIonicTextareaInputEditable();
      el.clear();
      el.sendKeys('I am new text');
      expect(page.getIonicTextareaInputOutputText()).toEqual('I am new text');
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
      expect(page.getIonicCheckboxOutputText()).toEqual('false');
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
      expect(page.getIonicToggleOutputText()).toEqual('true');
    });
  });
});

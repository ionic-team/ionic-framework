import { browser, ElementFinder, promise } from 'protractor/built';

import { GroupInputsPage } from './group-inputs.po';

describe('Group Inputs Page', () => {
  let page: GroupInputsPage;

  beforeEach(() => {
    page = new GroupInputsPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Ionic Core Group Inputs Demo');
  });

  describe('radio group', () => {
    it('should have the proper initial value', () => {
      page.navigateTo();
      const el = page.getRaioGroup();
      expect(el.getAttribute('value')).toEqual('tripe');
    });

    it('should check the proper initial radio button', () => {
      page.navigateTo();
      const btns = page.getGroupedRadioButtons();
      expect(btns.tripe.getAttribute('checked')).toEqual('true');
      expect(btns.beef.getAttribute('checked')).toEqual(null);
      expect(btns.chicken.getAttribute('checked')).toEqual(null);
      expect(btns.brains.getAttribute('checked')).toEqual(null);
      expect(btns.tongue.getAttribute('checked')).toEqual(null);
    });

    it('should reflect back the changed value', () => {
      page.navigateTo();
      const btns = page.getGroupedRadioButtons();
      btns.chicken.click();
      expect(page.getRadioOutputText()).toEqual('chicken');
    });

    it('should check and uncheck the proper buttons on a changed value', () => {
      page.navigateTo();
      const btns = page.getGroupedRadioButtons();
      btns.chicken.click();
      expect(btns.chicken.getAttribute('checked')).toEqual('true');
      expect(btns.beef.getAttribute('checked')).toEqual(null);
      expect(btns.tripe.getAttribute('checked')).toEqual(null);
      expect(btns.brains.getAttribute('checked')).toEqual(null);
      expect(btns.tongue.getAttribute('checked')).toEqual(null);
    });
  });

  describe('non-grouped radios', () => {
    it('should check the proper initial radio button', () => {
      page.navigateTo();
      const btns = page.getUngroupedRadioButtons();
      expect(btns.tripe.getAttribute('checked')).toEqual('true');
      expect(btns.beef.getAttribute('checked')).toEqual(null);
      expect(btns.chicken.getAttribute('checked')).toEqual(null);
      expect(btns.brains.getAttribute('checked')).toEqual(null);
      expect(btns.tongue.getAttribute('checked')).toEqual(null);
    });

    it('should reflect back the changed value', () => {
      page.navigateTo();
      return browser.executeScript('window.scrollTo(0, 500);').then(function() {
        const btns = page.getUngroupedRadioButtons();
        btns.chicken.click();
        expect(page.getRadioOutputText()).toEqual('chicken');
      });
    });

    it('should check and uncheck the proper buttons on a changed value', () => {
      page.navigateTo();
      return browser.executeScript('window.scrollTo(0, 500);').then(function() {
        const btns = page.getUngroupedRadioButtons();
        btns.chicken.click();
        expect(btns.chicken.getAttribute('checked')).toEqual('true');
        expect(btns.beef.getAttribute('checked')).toEqual(null);
        expect(btns.tripe.getAttribute('checked')).toEqual(null);
        expect(btns.brains.getAttribute('checked')).toEqual(null);
        expect(btns.tongue.getAttribute('checked')).toEqual(null);
      });
    });
  });
});

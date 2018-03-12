import { browser, by, element } from 'protractor';

export class GroupInputsPage {
  navigateTo() {
    return browser.get('/group-inputs');
  }

  getTitleText() {
    return element(by.css('.title')).getText();
  }

  getRaioGroup() {
    return element(by.id('radio-group'));
  }

  getGroupedRadioButtons() {
    return {
      beef: element(by.id('ion-grp-beef')),
      tongue: element(by.id('ion-grp-tongue')),
      brains: element(by.id('ion-grp-brains')),
      tripe: element(by.id('ion-grp-tripe')),
      chicken: element(by.id('ion-grp-chicken'))
    };
  }

  getSegmentButtons() {
    return {
      beef: element(by.id('ion-seg-beef')),
      tongue: element(by.id('ion-seg-tongue')),
      brains: element(by.id('ion-seg-brains')),
      tripe: element(by.id('ion-seg-tripe')),
      chicken: element(by.id('ion-seg-chicken'))
    };
  }

  getUngroupedRadioButtons() {
    return {
      beef: element(by.id('ion-beef')),
      tongue: element(by.id('ion-tongue')),
      brains: element(by.id('ion-brains')),
      tripe: element(by.id('ion-tripe')),
      chicken: element(by.id('ion-chicken'))
    };
  }

  getSegment() {
    return element(by.id('segment'));
  }

  getRadioOutputText() {
    return element(by.id('radioOutput')).getText();
  }

  getIonicSelect() {
    return element(by.id('ionSelect'));
  }

  getSelectOutput() {
    return element(by.id('selectOutput')).getText();
  }
}

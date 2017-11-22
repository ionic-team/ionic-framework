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

  getUngroupedRadioButtons() {
    return {
      beef: element(by.id('ion-beef')),
      tongue: element(by.id('ion-tongue')),
      brains: element(by.id('ion-brains')),
      tripe: element(by.id('ion-tripe')),
      chicken: element(by.id('ion-chicken'))
    };
  }

  getRadioOutputText() {
    return element(by.id('radioOutput')).getText();
  }
}

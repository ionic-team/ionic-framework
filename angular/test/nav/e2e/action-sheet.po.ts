import { browser, by, element } from 'protractor';

export class ActionSheetPage {
  navigateTo() {
    return browser.get('/actionSheet');
  }

  getButton() {
    return element(by.css('ion-button'));
  }

  getActionSheet() {
    return element(by.css('ion-action-sheet'));
  }

  getActionSheetCloseButton() {
    return element(by.css('.action-sheet-cancel'));
  }
}

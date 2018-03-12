import { browser, by, element } from 'protractor';

export class PopoverPage {
  navigateTo() {
    return browser.get('/popover');
  }

  getButton() {
    return element(by.css('ion-button'));
  }

  getPopover() {
    return element(by.css('ion-popover'));
  }

  getCloseButton() {
    return element(by.css('.popover-button'));
  }
}

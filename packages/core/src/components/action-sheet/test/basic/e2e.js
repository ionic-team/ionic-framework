'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page } = require('../../../../../scripts/e2e');

class ActionSheetE2ETestPage extends Page {
  constructor(driver) {
    super(driver, 'http://localhost:3333/src/components/action-sheet/test/basic/index.html');
  }

  present(buttonId) {
    this.navigate();
    this.driver.findElement(By.id(buttonId)).click();
    this.driver.wait(until.elementLocated(By.css('.action-sheet-container')));
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.action-sheet-container'))));
  }
}

describe('action-sheet/basic', () => {
  register('should init', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.navigate();
  });

  describe('present', () => {
    register('shows basic', driver => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('basic');
    });

    register('shows noBackdropDismiss',  (driver)  => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('noBackdropDismiss');
    });

    register('shows alertFromActionSheet',  (driver)  => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('alertFromActionSheet');
    });

    register('shows scrollableOptions',  (driver)  => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('scrollableOptions');
    });

    register('shows scrollWithoutCancel',  (driver)  => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('scrollWithoutCancel');
    });

    register('shows cancelOnly',  (driver)  => {
      const page = new ActionSheetE2ETestPage(driver);
      return page.present('cancelOnly');
    });
  });
});

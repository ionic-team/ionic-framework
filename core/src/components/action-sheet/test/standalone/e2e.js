'use strict';

const { By, until } = require('selenium-webdriver');
const { Page, platforms, register } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/action-sheet/test/standalone?ionic:mode=${platform}`);
  }

  async present(buttonId) {
    await this.navigate('#basic');
    this.driver.findElement(By.id(buttonId)).click();
    await this.driver.wait(until.elementLocated(By.css('.action-sheet-container')));
    return await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.action-sheet-container'))));
  }

  async closeWithBackdrop() {
    this.driver.findElement(By.css('ion-backdrop')).click();
    return await this.driver.wait(until.elementIsNotVisible(this.driver.findElement(By.css('ion-backdrop'))));
  }
}

platforms.forEach(platform => {
  describe('action-sheet/standalone', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#basic');
    });

    register('should open action sheet', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('basic');
    });

    register('should close with backdrop click', async driver => {
      const page = new E2ETestPage(driver, platform);
      await page.present('basic');
      return page.closeWithBackdrop();
    });

    register('shows noBackdropDismiss',  (driver)  => {
      const page = new E2ETestPage(driver, platform);
      return page.present('noBackdropDismiss');
    });

    register('shows alertFromActionSheet',  (driver)  => {
      const page = new E2ETestPage(driver, platform);
      return page.present('alertFromActionSheet');
    });

    register('shows scrollableOptions',  (driver)  => {
      const page = new E2ETestPage(driver, platform);
      return page.present('scrollableOptions');
    });

    register('shows scrollWithoutCancel',  (driver)  => {
      const page = new E2ETestPage(driver, platform);
      return page.present('scrollWithoutCancel');
    });

    register('shows cancelOnly',  (driver)  => {
      const page = new E2ETestPage(driver, platform);
      return page.present('cancelOnly');
    });
  });
});

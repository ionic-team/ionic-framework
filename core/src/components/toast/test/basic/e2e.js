'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/toast/test/basic?ionic:mode=${platform}`);
  }

  async present(buttonId) {
    await this.navigate('#content');
    this.driver.findElement(By.id(buttonId)).click();
    await this.driver.wait(until.elementLocated(By.css('.toast-wrapper')));
    return await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.toast-wrapper'))));
  }

  async closeWithBackdrop() {
    this.driver.findElement(By.css('ion-backdrop')).click();
    return await this.driver.wait(until.elementIsNotVisible(this.driver.findElement(By.css('ion-backdrop'))));
  }
}

platforms.forEach(platform => {
  describe('toast/basic', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#content');
    });

    register('shows bottom toast', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('showBottomToast');
    });
  });
});

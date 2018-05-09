'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/alert/test/standalone?ionic:mode=${platform}`);
  }

  async present(buttonId) {
    await this.navigate('#basic');
    this.driver.findElement(By.id(buttonId)).click();
    await this.driver.wait(until.elementLocated(By.css('.alert-wrapper')));
    return await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.alert-wrapper'))));
  }

  async closeWithBackdrop() {
    this.driver.findElement(By.css('ion-backdrop')).click();
    return await this.driver.wait(until.elementIsNotVisible(this.driver.findElement(By.css('ion-backdrop'))));
  }
}

platforms.forEach(platform => {
  describe('alert/standalone', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#basic');
    });

    register('should open basic alert', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('basic');
    });

    register('should open alert long message', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('longMessage');
    });

    register('should open alert multiple buttons', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('multipleButtons');
    });

    register('should open alert no message', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('noMessage');
    });

    register('should open confirm alert', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('confirm');
    });

    register('should open prompt alert', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('prompt');
    });

    register('should open radio alert', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('radio');
    });

    register('should open checkbox alert', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('checkbox');
    });
  });
});

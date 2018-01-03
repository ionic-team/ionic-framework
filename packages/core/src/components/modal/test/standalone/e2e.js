'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/modal/test/standalone?ionicplatform=${platform}`);
  }

  present(buttonId) {
    this.navigate();
    this.driver.findElement(By.id(buttonId)).click();
    this.driver.wait(until.elementLocated(By.css('.modal-wrapper')));
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.modal-wrapper'))));
  }
}

platforms.forEach(platform => {
  describe('modal/standalone', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate();
    });

    register('shows basic modal', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('basic');
    });
  });
});

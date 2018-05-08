'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/datetime/test/basic?ionic:mode=${platform}`);
  }

  async present(buttonId) {
    await this.navigate('#content');
    this.driver.findElement(By.id(buttonId)).click();
    await this.driver.wait(until.elementLocated(By.css('.picker-wrapper')));
    return await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.picker-wrapper'))));
  }
}

platforms.forEach(platform => {
  describe('datetime/basic', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#content');
    });

    register('should open custom picker', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('customPickerOptions');
    });
  });
});

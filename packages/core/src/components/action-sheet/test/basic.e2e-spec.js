'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const register = require('../../../../scripts/register-e2e-test');

class Page {
  constructor(driver) {
    this.url = 'http://localhost:3333/src/components/action-sheet/test/basic.html';
    this.driver = driver;
  }

  navigate() {
    this.driver.navigate().to(this.url);
    this.driver.wait(until.elementLocated(By.id('cancelOnly')));
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id('cancelOnly'))));
  }

  present(buttonId) {
    this.navigate();
    this.driver.findElement(By.id(buttonId)).click();
    this.driver.wait(until.elementLocated(By.css('.action-sheet-container')));
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.action-sheet-container'))));
  }
}

describe('action-sheet: basic', () => {
  register('navigates', driver => {
    const page = new Page(driver);
    return page.navigate();
  });

  describe('present', () => {
    register('shows basic', driver => {
      const page = new Page(driver);
      return page.present('basic');
    });

    register('shows noBackdropDismiss',  (driver)  => {
      const page = new Page(driver);
      return page.present('noBackdropDismiss');
    });

    register('shows alertFromActionSheet',  (driver)  => {
      const page = new Page(driver);
      return page.present('alertFromActionSheet');
    });

    register('shows scrollableOptions',  (driver)  => {
      const page = new Page(driver);
      return page.present('scrollableOptions');
    });

    register('shows scrollWithoutCancel',  (driver)  => {
      const page = new Page(driver);
      return page.present('scrollWithoutCancel');
    });

    register('shows cancelOnly',  (driver)  => {
      const page = new Page(driver);
      return page.present('cancelOnly');
    });
  });
});

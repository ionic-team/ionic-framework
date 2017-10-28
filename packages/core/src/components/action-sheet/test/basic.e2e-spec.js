'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const url = 'http://localhost:3333/src/components/action-sheet/test/basic.html';

describe('action-sheet: basic', () => {
  it('navigates', () => {
    const driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.navigate().to(url);
    driver.wait(until.elementLocated(By.id('cancelOnly')));
    driver.wait(until.elementIsVisible(driver.findElement(By.id('cancelOnly'))));
    return driver.quit();
  });

  describe('present', () => {
    it('shows basic', () => {
      const driver = new webdriver.Builder().forBrowser('chrome').build();
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('basic'))));
      driver.findElement(By.id('basic')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
      return driver.quit();
    });

    it('shows noBackdropDismiss', () => {
      const driver = new webdriver.Builder().forBrowser('chrome').build();
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('noBackdropDismiss'))));
      driver.findElement(By.id('noBackdropDismiss')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
      return driver.quit();
    });

    it('shows alertFromActionSheet', () => {
      const driver = new webdriver.Builder().forBrowser('chrome').build();
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('alertFromActionSheet'))));
      driver.findElement(By.id('alertFromActionSheet')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
      return driver.quit();
    });

    it('shows scrollableOptions', () => {
      const driver = new webdriver.Builder().forBrowser('chrome').build();
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('scrollableOptions'))));
      driver.findElement(By.id('scrollableOptions')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
      return driver.quit();
    });

    it('shows scrollWithoutCancel', () => {
      const driver = new webdriver.Builder().forBrowser('chrome').build();
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('scrollWithoutCancel'))));
      driver.findElement(By.id('scrollWithoutCancel')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
      return driver.quit();
    });

    it('shows cancelOnly', () => {
      const driver = new webdriver.Builder().forBrowser('chrome').build();
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('cancelOnly'))));
      driver.findElement(By.id('cancelOnly')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
      return driver.quit();
    });
  });
});

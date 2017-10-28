'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const register = require('../../../../scripts/register-e2e-test');

const url = 'http://localhost:3333/src/components/action-sheet/test/basic.html';

describe('action-sheet: basic', () => {
  register('navigates', (driver) => {
    driver.navigate().to(url);
    driver.wait(until.elementLocated(By.id('cancelOnly')));
    return driver.wait(until.elementIsVisible(driver.findElement(By.id('cancelOnly'))));
  });

  describe('present', () => {
    register('shows basic', (driver) => {
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('basic'))));
      driver.findElement(By.id('basic')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      return driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
    });

    register('shows noBackdropDismiss', (driver) => {
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('noBackdropDismiss'))));
      driver.findElement(By.id('noBackdropDismiss')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      return driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
    });

    register('shows alertFromActionSheet', (driver) => {
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('alertFromActionSheet'))));
      driver.findElement(By.id('alertFromActionSheet')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      return driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
    });

    register('shows scrollableOptions', (driver) => {
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('scrollableOptions'))));
      driver.findElement(By.id('scrollableOptions')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      return driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
    });

    register('shows scrollWithoutCancel', (driver) => {
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('scrollWithoutCancel'))));
      driver.findElement(By.id('scrollWithoutCancel')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      return driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
    });

    register('shows cancelOnly', (driver) => {
      driver.navigate().to(url);
      driver.wait(until.elementIsEnabled(driver.findElement(By.id('cancelOnly'))));
      driver.findElement(By.id('cancelOnly')).click();
      driver.wait(until.elementLocated(By.css('.action-sheet-container')));
      return driver.wait(until.elementIsVisible(driver.findElement(By.css('.action-sheet-container'))));
    });
  });
});

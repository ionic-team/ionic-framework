'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page } = require('../../../../../scripts/e2e');

class ActionSheetE2ETestPage extends Page {
  constructor(driver) {
    super(driver, 'http://localhost:3333/src/components/alert/test/basic');
  }

  present(buttonId) {
    this.navigate();
    this.driver.findElement(By.id(buttonId)).click();
    this.driver.wait(until.elementLocated(By.css('.alert-wrapper')));
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.alert-wrapper'))));
  }

  closeWithBackdrop() {
    this.driver.findElement(By.css('ion-backdrop')).click();
  }
}

describe('alert/basic', () => {
  register('should init', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.navigate();
  });

  register('should open basic alert', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('basic');
  });

  register('should open alert long message', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('longMessage');
  });

  register('should open alert multiple buttons', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('multipleButtons');
  });

  register('should open alert no message', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('noMessage');
  });

  register('should open confirm alert', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('confirm');
  });

  register('should open prompt alert', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('prompt');
  });

  register('should open radio alert', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('radio');
  });

  register('should open checkbox alert', driver => {
    const page = new ActionSheetE2ETestPage(driver);
    return page.present('checkbox');
  });

});

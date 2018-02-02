'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');
const expect = require('chai').expect;

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/events/test/basic?ionicplatform=${platform}`);
  }
}

platforms.forEach(platform => {
  describe('events/basic', () => {

    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#content');
    });

    register('subscribers should receive event on or shortly after button click', async (driver, testContext) => {
      testContext.timeout(1000);
      const page = new E2ETestPage(driver, platform);
      await wait(300);

      // go to page two
      const publishButtonSelector = 'ion-button';
      const publishButton = await getElement(driver, publishButtonSelector);
      publishButton.click();
      await wait(300);

      const secretOneElement = await getElement(driver, '.secret-one');
      const secretOneText = await secretOneElement.getText();
      expect(secretOneText).to.equal('Taco');

      const secretTwoElement = await getElement(driver, '.secret-two');
      const secretTwoText = await secretTwoElement.getText();
      expect(secretTwoText).to.equal('Burrito');
    });
  });
});

async function getElement(driver, selector) {
  driver.wait(until.elementLocated(By.css(selector)));
  const element = driver.findElement(By.css(selector));
  await driver.wait(until.elementIsVisible(driver.findElement(By.css(selector))));
  return element;
}

function wait(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}

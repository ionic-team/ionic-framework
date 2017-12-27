'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/tabs/test/vanilla?ionicplatform=${platform}`);
  }
}

platforms.forEach(platform => {
  describe('tabs/vanilla', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate();
    });

    register('should check each tab', async (driver, testContext) => {
      testContext.timeout(60000);
      const page = new E2ETestPage(driver, platform);

      await waitForTransition(300);

      const tabTwoButton = await waitAndGetElementById(driver, 'tab-t-0-1');
      tabTwoButton.click();
      await waitForTransition(600);

      const tabThreeButton = await waitAndGetElementById(driver, 'tab-t-0-2');
      tabThreeButton.click();
      await waitForTransition(600);
    });
  });
});

async function waitAndGetElement(driver, selector) {
  driver.wait(until.elementLocated(By.css(selector)));
  const element = driver.findElement(By.css(selector));
  await driver.wait(until.elementIsVisible(driver.findElement(By.css(selector))));
  return element;
}

async function waitAndGetElementById(driver, selector) {
  driver.wait(until.elementLocated(By.id(selector)));
  const element = driver.findElement(By.id(selector));
  await driver.wait(until.elementIsVisible(driver.findElement(By.id(selector))));
  return element;
}

function waitForTransition(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}
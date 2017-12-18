'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/nav/test/basic?ionicplatform=${platform}`);
  }
}

platforms.forEach(platform => {
  describe('nav/basic', () => {

    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate();
    });

    register('should go to page-one, page-two, page-three, then back to page-two, page-one', async (driver, testContext) => {

      testContext.timeout(10000);
      const page = new E2ETestPage(driver, platform);

      // go to page two
      const pageOneNextButtonSelector = '.first-page ion-button.next.hydrated';
      const pageOneNextButton = await getElement(driver, pageOneNextButtonSelector);
      pageOneNextButton.click();
      await waitForTransition(600);

      // go to page three
      const pageTwoNextButtonSelector = '.second-page ion-button.next.hydrated';
      const pageTwoNextButton = await getElement(driver, pageTwoNextButtonSelector);
      pageTwoNextButton.click();
      await waitForTransition(600);

      // go back to page two
      const pageThreeBackButtonSelector = '.third-page ion-button.previous.hydrated';
      const pageThreeBackButton = await getElement(driver, pageThreeBackButtonSelector);
      pageThreeBackButton.click();
      await waitForTransition(600);

      // go back to page two
      const pageTwoBackButtonSelector = '.second-page ion-button.previous.hydrated';
      const pageTwoBackButton = await getElement(driver, pageTwoBackButtonSelector);
      pageTwoBackButton.click();
      await waitForTransition(600);

      // we're back on page one now
    });
  });
});

async function getElement(driver, selector) {
  driver.wait(until.elementLocated(By.css(selector)));
  const element = driver.findElement(By.css(selector));
  await driver.wait(until.elementIsVisible(driver.findElement(By.css(selector))));
  return element;
}

function waitForTransition(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}

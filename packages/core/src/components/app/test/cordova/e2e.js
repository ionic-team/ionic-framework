'use strict';

const { register, Page, platforms } = require('../../../../../scripts/e2e');
const { getElement, waitForTransition } = require('../../../../../scripts/e2e/utils');
const expect = require('chai').expect;

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/app/test/cordova?ionicplatform=${platform}`);
  }
}

platforms.forEach(platform => {
  describe('app/cordova', () => {

    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate();
    });

    register('should have status bar padding for all pages', async (driver, testContext) => {

      testContext.timeout(10000);
      const page = new E2ETestPage(driver, platform);

      await waitForTransition(200);
      const pageOneToolbarSelector = 'page-one ion-toolbar';
      const pageOneToolbar = await getElement(driver, pageOneToolbarSelector);
      const paddingTopPageOne = await pageOneToolbar.getCssValue('padding-top');
      if (platform === 'ios') {
        expect(paddingTopPageOne).to.equal('24px');
      } else {
        expect(paddingTopPageOne).to.equal('24px');
      }


      // navigate to a second page just to verify it's working and still has padding
      const pageOneNextButtonSelector = 'page-one ion-button.next';
      const pageOneNextButton = await getElement(driver, pageOneNextButtonSelector);
      await pageOneNextButton.click();
      await waitForTransition(600);

      const pageTwoToolbarSelector = 'page-two ion-toolbar';
      const pageTwoToolbar = await getElement(driver, pageTwoToolbarSelector);
      const paddingTopPageTwo = await pageTwoToolbar.getCssValue('padding-top');
      if (platform === 'ios') {
        expect(paddingTopPageTwo).to.equal('24px');
      } else {
        expect(paddingTopPageTwo).to.equal('24px');
      }

    });
  });
});

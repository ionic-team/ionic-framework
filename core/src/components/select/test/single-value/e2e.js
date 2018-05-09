
'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/select/test/single-value?ionic:mode=${platform}`);
  }
}

platforms.forEach(platform => {
  describe('select/single-value', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#gender');
    });

    register('should open gender single select', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('#gender', { waitFor: '.alert-wrapper'});
    });
  });
});

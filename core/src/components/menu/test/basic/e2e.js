'use strict';

const { By, until } = require('selenium-webdriver');
const { register, Page, platforms } = require('../../../../../scripts/e2e');

class E2ETestPage extends Page {
  constructor(driver, platform) {
    super(driver, `http://localhost:3333/src/components/menu/test/basic?ionic:mode=${platform}`);
  }
}

platforms.forEach(platform => {
  describe('menu/basic', () => {
    register('should init', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.navigate('#left');
    });

    register('should Open start menu', driver => {
      const page = new E2ETestPage(driver, platform);
      return page.present('#left', { waitFor: '.menu-inner' });
    });
  });
});

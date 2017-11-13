const { By, until } = require('selenium-webdriver');
const { register, Page } = require('../../../../../scripts/e2e');

describe('checkbox: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/checkbox/test/basic');
    return page.navigate();
  });

});

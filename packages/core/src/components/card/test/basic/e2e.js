const { By, until } = require('selenium-webdriver');
const { register, Page } = require('../../../../../scripts/e2e');

describe('card: basic', () => {

  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/card/test/basic');
    return page.navigate();
  });

});

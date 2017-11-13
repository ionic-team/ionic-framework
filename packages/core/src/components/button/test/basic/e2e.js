'use strict';

const { register, Page } = require('../../../../../scripts/e2e');

describe('button: basic', () => {
  register('navigates', driver => {
    const page = new Page(driver, 'http://localhost:3333/src/components/button/test/basic');
    return page.navigate();
  });
});

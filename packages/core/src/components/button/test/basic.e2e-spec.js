'use strict';

const register = require('../../../../scripts/e2e-test-runner').register;
const E2ETestPage = require('../../../../scripts/E2ETestPage');

describe('button: basic', () => {
  register('navigates', driver => {
    const page = new E2ETestPage(driver, 'http://localhost:3333/src/components/button/test/basic.html');
    return page.navigate();
  });
});

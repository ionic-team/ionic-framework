'use strict';

const register = require('../../../../scripts/register-e2e-test');
const E2ETestPage = require('../../../../scripts/E2ETestPage');

describe('button: toolbar', () => {
  register('navigates', (driver) => {
    const page = new E2ETestPage(driver, 'http://localhost:3333/src/components/button/test/toolbar.html');
    return page.navigate();
  });
});

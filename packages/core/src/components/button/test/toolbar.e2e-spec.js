const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

const register = require('../../../../scripts/register-e2e-test');

describe('button: toolbar', () => {
  register('navigates', (driver) => {
    return driver.navigate().to('http://localhost:3333/src/components/button/test/toolbar.html');
  });
});

/**
 * This runs before each test suite and is an opportunity
 * to set up the test environment.
 */
const chromedriver = require('chromedriver');
const webdriver = require('selenium-webdriver');
const utils = require('./utils');

global.driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

const platforms = [
  'android',
  'ios'
];

const getTestURL = (desc, platform) => {
  const [componentName, testName] = /(.+)\/(.+)/.exec(desc).slice(1);
  return `http://localhost:3333/src/components/${componentName}/test/${testName}?ionicPlatform=${platform}`;
};

/**
 * Monkey-patch describe to run the callback for each platform
 * then pass a pre-built test URL and utils.
 */
const _describe = describe;
global.describe = (desc, callback) => {
  platforms.forEach(platform => {

    _describe(`${desc}: ${platform}`, () => {
      callback(getTestURL(desc, platform), utils);
    });

  });
};

afterAll(() => driver.quit());

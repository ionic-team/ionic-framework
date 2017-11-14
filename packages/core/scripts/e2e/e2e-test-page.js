const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

module.exports = class E2ETestPage {
  constructor(driver, url) {
    this.url = url;
    this.driver = driver;
  }

  navigate() {
    this.driver.navigate().to(this.url);
    this.driver.wait(until.elementLocated(By.css('.hydrated')));
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.hydrated'))));
  }
}

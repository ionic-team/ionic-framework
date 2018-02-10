const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;

module.exports = class E2ETestPage {
  constructor(driver, url) {
    this.url = url;
    this.driver = driver;
  }

  async navigate(tagName = '') {
    this.driver.navigate().to(this.url);
    this.driver.manage().timeouts().implicitlyWait(10000);
    await this.driver.wait(until.elementLocated(By.css(`.hydrated`)));
    const tag = tagName || '.hydrated';
    return await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css(tag))));
  }

  async present(clickTarget, options) {
    await this.navigate(clickTarget);
    this.driver.findElement(By.css(clickTarget)).click();
    await this.driver.wait(until.elementLocated(By.css(options.waitFor)));
    return await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css(options.waitFor))));
  }
}

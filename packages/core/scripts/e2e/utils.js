const { By, until } = require('selenium-webdriver');

async function getElement(driver, selector) {
  driver.wait(until.elementLocated(By.css(selector)));
  const element = driver.findElement(By.css(selector));
  await driver.wait(until.elementIsVisible(driver.findElement(By.css(selector))));
  return element;
}

async function waitAndGetElementById(driver, selector) {
  driver.wait(until.elementLocated(By.id(selector)));
  const element = driver.findElement(By.id(selector));
  await driver.wait(until.elementIsVisible(driver.findElement(By.id(selector))));
  return element;
}

function waitForTransition(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  })
}

module.exports = {
  getElement: getElement,
  waitForTransition: waitForTransition,
  waitAndGetElementById: waitAndGetElementById
}

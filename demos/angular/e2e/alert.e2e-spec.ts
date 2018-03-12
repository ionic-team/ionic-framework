import { browser, ElementFinder } from 'protractor/built';

import { AlertPage } from './alert.po';
import { sleep } from './utils/helpers';

describe('Alert Page', () => {
  let page: AlertPage;

  beforeEach(() => {
    page = new AlertPage();
  });

  it('should open page', async (done) => {
    await page.navigateTo();
    done();
  });

  it('should open the alert, then close it using the close button', async (done) => {
    const button = await page.getButton();
    await sleep(100);
    await button.click();
    await sleep(500);
    let alert = await page.getAlert();
    expect(await alert.isPresent()).toBeTruthy();
    const closeButton = await page.getCloseButton();
    await closeButton.click();
    await sleep(500);
    alert = null;
    alert = await page.getAlert();
    expect(await alert.isPresent()).toBeFalsy();
    done();
  });
});

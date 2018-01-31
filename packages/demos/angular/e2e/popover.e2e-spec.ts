import { browser, ElementFinder } from 'protractor/built';

import { PopoverPage } from './popover.po';
import { sleep } from './utils/helpers';

describe('Popover Page', () => {
  let page: PopoverPage;

  beforeEach(() => {
    page = new PopoverPage();
  });

  it('should open page', async (done) => {
    await page.navigateTo();
    done();
  });

  it('should open the popover, then close it using the close button', async (done) => {
    const button = await page.getButton();
    await sleep(100);
    await button.click();
    await sleep(500);
    let popover = await page.getPopover();
    expect(await popover.isPresent()).toBeTruthy();
    const closeButton = await page.getCloseButton();
    await closeButton.click();
    await sleep(500);
    popover = null;
    popover = await page.getPopover();
    expect(await popover.isPresent()).toBeFalsy();
    done();
  });
});

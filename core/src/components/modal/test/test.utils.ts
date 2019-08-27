import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export const testModal = async (
  type: string,
  selector: string,
  rtl = false
) => {
  const pageUrl = generateE2EUrl('modal', type, rtl);

  const page = await newE2EPage({
    url: pageUrl
  });

  const screenshotCompares = [];

  await page.click(selector);
  await page.waitForSelector(selector);

  let modal = await page.find('ion-modal');
  await modal.waitForVisible();
  await page.waitFor(100);

  screenshotCompares.push(await page.compareScreenshot());

  await modal.callMethod('dismiss');
  await modal.waitForNotVisible();

  screenshotCompares.push(await page.compareScreenshot('dismiss'));

  modal = await page.find('ion-modal');
  expect(modal).toBeNull();

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
};

import { newE2EPage } from '@stencil/core/testing';

import { cleanScreenshotName, generateE2EUrl } from '../../../utils/test/utils';

export async function testModal(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    const pageUrl = generateE2EUrl('modal', type, rtl);
    if (rtl) {
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let modal = await page.find('ion-modal');
    await modal.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot(screenshotName));

    await modal.callMethod('dismiss');
    await modal.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    modal = await page.find('ion-modal');
    expect(modal).toBeNull();

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

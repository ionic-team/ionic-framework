import { newE2EPage } from '@stencil/core/testing';

import { cleanScreenshotName, generateE2EUrl } from '../../../utils/test/utils';

export async function testPopover(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    const pageUrl = generateE2EUrl('popover', type, rtl);
    if (rtl) {
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let popover = await page.find('ion-popover');
    await popover.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot(screenshotName));

    await popover.callMethod('dismiss');
    await popover.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    popover = await page.find('ion-popover');
    expect(popover).toBeNull();

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

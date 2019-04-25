import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export async function testToast(
  type: string,
  selector: string,
  rtl = false
) {
  try {
    const pageUrl = generateE2EUrl('toast', type, rtl);

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let toast = await page.find('ion-toast');

    expect(toast).not.toBe(null);
    await toast.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot());

    await toast.callMethod('dismiss');
    await toast.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot('dismiss'));

    toast = await page.find('ion-toast');
    expect(toast).toBe(null);

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

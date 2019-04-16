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

    const button = await page.find(selector);
    await button.click();

    let toast = await page.find('ion-toast');
    await toast.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot());

    await toast.callMethod('dismiss');
    await toast.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot('dismiss'));

    toast = await page.find('ion-toast');
    expect(toast).toBeNull();

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

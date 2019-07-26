import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export const testToast = async (
  type: string,
  selector: string,
  rtl = false
) => {
  try {
    const pageUrl = generateE2EUrl('toast', type, rtl);

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    const button = await page.find(selector);
    await button.waitForVisible();
    await button.click();

    await page.waitFor(250);

    let toast = await page.find('ion-toast');
    await toast.waitForVisible();

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
};

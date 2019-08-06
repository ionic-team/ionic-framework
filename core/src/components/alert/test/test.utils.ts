import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export const testAlert = async (
  type: string,
  selector: string,
  rtl = false
) => {
  try {
    const pageUrl = generateE2EUrl('alert', type, rtl);

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let alert = await page.find('ion-alert');

    expect(alert).not.toBe(null);
    await alert.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot());

    await alert.callMethod('dismiss');
    await alert.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot('dismiss'));

    alert = await page.find('ion-alert');
    expect(alert).toBe(null);

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
};

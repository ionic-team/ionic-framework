import { newE2EPage } from '@stencil/core/testing';

import { cleanScreenshotName, generateE2EUrl } from '../../../utils/test/utils';

export async function testLoading(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    const pageUrl = generateE2EUrl('loading', type, rtl);
    if (rtl) {
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenShotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let loading = await page.find('ion-loading');
    expect(loading).not.toBeNull();

    await loading.waitForVisible();

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await loading.callMethod('dismiss');
    await loading.waitForNotVisible();

    screenShotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    loading = await page.find('ion-loading');
    expect(loading).toBeNull();

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

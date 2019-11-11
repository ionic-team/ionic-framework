import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export const testLoading = async (
  type: string,
  selector: string,
  rtl = false
) => {
  try {
    const pageUrl = generateE2EUrl('loading', type, rtl);

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let loading = await page.find('ion-loading');
    expect(loading).not.toBeNull();

    await loading.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot());

    await loading.callMethod('dismiss');
    await loading.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot('dismiss'));

    loading = await page.find('ion-loading');
    expect(loading).toBeNull();

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
};

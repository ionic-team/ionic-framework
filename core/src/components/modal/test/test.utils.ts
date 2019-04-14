import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export async function testModal(
  type: string,
  selector: string,
  rtl = false
) {
  try {
    const pageUrl = generateE2EUrl('modal', type, rtl);

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    await page.click(selector);
    await page.waitForSelector(selector);

    let popover = await page.find('ion-modal');
    await popover.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot());

    await popover.callMethod('dismiss');
    await popover.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot('dismiss'));

    popover = await page.find('ion-modal');
    expect(popover).toBeNull();

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

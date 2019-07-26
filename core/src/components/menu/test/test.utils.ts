import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export const testMenu = async (
  type: string,
  selector: string,
  menuId = '',
  rtl = false
) => {
  try {
    const pageUrl = generateE2EUrl('menu', type, rtl);

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    if (menuId.length > 0) {
      const menuCtrl = await page.find('ion-menu-controller');
      await page.waitFor(250);
      await menuCtrl.callMethod('enable', true, menuId);
    }

    const menu = await page.find(selector);

    await menu.callMethod('open');
    await page.waitFor(250);

    screenshotCompares.push(await page.compareScreenshot());

    await menu.callMethod('close');
    await page.waitFor(250);

    screenshotCompares.push(await page.compareScreenshot('dismiss'));

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }
  } catch (err) {
    throw err;
  }
};

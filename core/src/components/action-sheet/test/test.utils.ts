import { newE2EPage } from '@stencil/core/testing';

import { cleanScreenshotName, generateE2EUrl } from '../../../utils/test/utils';

export async function testActionSheet(
  type: string,
  selector: string,
  rtl = false,
  afterScreenshotHook = async (..._args: any[]): Promise<void> => {/**/},
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    const pageUrl = generateE2EUrl('action-sheet', type, rtl);
    if (rtl) {
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenShotCompares = [];

    const presentBtn = await page.find(selector);
    await presentBtn.click();

    let actionSheet = await page.find('ion-action-sheet');
    await actionSheet.waitForVisible();

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await afterScreenshotHook(page, screenshotName, screenShotCompares, actionSheet);

    await actionSheet.callMethod('dismiss');
    await actionSheet.waitForNotVisible();

    screenShotCompares.push(await page.compareScreenshot(`dismissed ${screenshotName}`));

    actionSheet = await page.find('ion-action-sheet');
    expect(actionSheet).toBe(null);

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

export async function testActionSheetBackdrop(
  page: any,
  screenshotName: string,
  screenShotCompares: any,
  actionSheet: any
) {
  try {
    console.log('backdrop hook');
    const backdrop = await page.find('ion-backdrop');
    await backdrop.click();

    screenShotCompares.push(await page.compareScreenshot(`dismissed backdrop ${screenshotName}`));

    const isVisible = await actionSheet.isVisible();
    expect(isVisible).toBe(true);
} catch (err) {
    throw err;
  }
}

export async function testActionSheetAlert(
  page: any,
  screenshotName: string,
  screenShotCompares: any
) {
  try {
    const openAlertBtn = await page.find({ text: 'Open Alert' });
    await openAlertBtn.click();

    const alert = await page.find('ion-alert');
    await alert.waitForVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(`alert open ${screenshotName}`));

    const alertOkayBtn = await page.find({ contains: 'Okay' });
    await alertOkayBtn.click();
  } catch (err) {
    throw err;
  }
}

import { newE2EPage } from '@stencil/core/testing';

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

export async function testActionSheet(
  type: string,
  selector: string,
  rtl = false,
  backdrop = true,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    let pageUrl = `/src/components/action-sheet/test/${type}?ionic:_testing=true`;
    if (rtl) {
      pageUrl = `${pageUrl}&rtl=true`;
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

    /**
     * If backdrop dismiss is not enabled
     * test to make sure it is actually disabled
     * as intended
     */
    if (!backdrop) {
      const backdrop = await page.find('ion-backdrop');
      await backdrop.click();

      screenShotCompares.push(await page.compareScreenshot(`dismissed backdrop ${screenshotName}`));

      const isVisible = await actionSheet.isVisible();
      expect(isVisible).toBe(true);
    }

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

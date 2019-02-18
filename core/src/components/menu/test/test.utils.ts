import { newE2EPage } from '@stencil/core/testing';

export function cleanScreenshotName(screenshotName: string): string {
  return screenshotName
    .replace(/([-])/g, ' ')
    .replace(/[^0-9a-zA-Z\s]/gi, '')
    .toLowerCase();
}

export async function testMenu(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    let pageUrl = `/src/components/menu/test/${type}?ionic:_testing=true`;
    if (rtl) {
      pageUrl = `${pageUrl}&rtl=true`;
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenShotCompares = [];

    const menu = await page.find(selector);

    await menu.callMethod('open');
    await menu.waitForVisible();
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(screenshotName));

    await menu.callMethod('close');
    await page.waitFor(250);

    screenShotCompares.push(await page.compareScreenshot(`dismiss ${screenshotName}`));

    for (const screenShotCompare of screenShotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }
  } catch (err) {
    throw err;
  }
}

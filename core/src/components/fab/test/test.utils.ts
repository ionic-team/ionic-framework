import { newE2EPage } from '@stencil/core/testing';

import { cleanScreenshotName, generateE2EUrl } from '../../../utils/test/utils';

export async function testFAB(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    const pageUrl = generateE2EUrl('fab', type, rtl);
    if (rtl) {
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];
    screenshotCompares.push(await page.compareScreenshot(`${screenshotName}`));

    const fab = await getFABComponent(page, selector);
    await fab.click();

    await ensureFABState(fab, 'active');

    screenshotCompares.push(await page.compareScreenshot(`${screenshotName} open`));

    const fabButton = await getFABButton(fab);
    await fabButton.click();

    await ensureFABState(fab, 'inactive');

    screenshotCompares.push(await page.compareScreenshot(`${screenshotName} close`));

    for (const screenShotCompare of screenshotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }
  } catch (err) {
    throw err;
  }
}

export async function testDisabledFAB(
  type: string,
  selector: string,
  rtl = false,
  screenshotName: string = cleanScreenshotName(selector)
) {
  try {
    const pageUrl = generateE2EUrl('fab', type, rtl);
    if (rtl) {
      screenshotName = `${screenshotName} rtl`;
    }

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];
    screenshotCompares.push(await page.compareScreenshot(`disabled ${screenshotName}`));

    const fab = await getFABComponent(page, selector);
    await fab.click();

    await ensureFABState(fab, 'inactive');

    screenshotCompares.push(await page.compareScreenshot(`disabled ${screenshotName} attempt open`));

    for (const screenShotCompare of screenshotCompares) {
      expect(screenShotCompare).toMatchScreenshot();
    }
  } catch (err) {
    throw err;
  }
}

async function getFABComponent(page: any, selector: string) {
  return page.find(selector);
}

async function getFABButton(fabComponent: any) {
  return fabComponent.find('ion-fab-button');
}

async function getFABList(fabComponent: any) {
  return fabComponent.find('ion-fab-list');
}

async function ensureFABState(fab: any, state: string) {
  const active = (state === 'active') ? true : false;

  const fabList = await getFABList(fab);
  expect(fabList.classList.contains('fab-list-active')).toBe(active);
}

import type { E2EPage} from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';
import { generateE2EUrl } from '@utils/test';

export const openModal = async (
  page: E2EPage,
  selector: string
) => {
  const ionModalWillPresent = await page.spyOnEvent('ionModalWillPresent');
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click(selector);

  await ionModalWillPresent.next();
  await ionModalDidPresent.next();

  await page.waitForSelector(selector);

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();
  await page.waitForTimeout(100);

  return modal;
}

export const testModal = async (
  type: string,
  selector: string,
  expectUnmount = true,
  rtl = false
) => {
  const pageUrl = generateE2EUrl('modal', type, rtl);

  const page = await newE2EPage({
    url: pageUrl
  });

  const screenshotCompares = [];
  const ionModalWillDismiss = await page.spyOnEvent('ionModalWillDismiss');
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  let modal = await openModal(page, selector);

  screenshotCompares.push(await page.compareScreenshot());

  await modal.callMethod('dismiss');

  await ionModalWillDismiss.next();
  await ionModalDidDismiss.next();

  await modal.waitForNotVisible();

  screenshotCompares.push(await page.compareScreenshot('dismiss'));

  if (expectUnmount) {
    modal = await page.find('ion-modal');
    expect(modal).toBeNull();
  }

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
};

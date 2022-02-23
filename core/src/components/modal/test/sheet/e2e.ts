import { newE2EPage } from '@stencil/core/testing';
import { testModal } from '../test.utils';
import { getActiveElement, getActiveElementParent } from '@utils/test';

const DIRECTORY = 'sheet';

test('modal: sheet', async () => {
  await testModal(DIRECTORY, '#sheet-modal');
});

test('modal:rtl: sheet', async () => {
  await testModal(DIRECTORY, '#sheet-modal', true);
});

test('modal - open', async () => {
  const screenshotCompares = [];
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });

  await page.click('#sheet-modal');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  await modal.callMethod('dismiss');
  await modal.waitForNotVisible();

  screenshotCompares.push(await page.compareScreenshot('dismiss'));

  await page.click('#sheet-modal');

  const modalAgain = await page.find('ion-modal');
  await modalAgain.waitForVisible();

  screenshotCompares.push(await page.compareScreenshot());

  await modalAgain.callMethod('dismiss');
  await modalAgain.waitForNotVisible();

  screenshotCompares.push(await page.compareScreenshot('dismiss'));

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});

test('should click to dismiss sheet modal', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await page.click('#sheet-modal');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();

  await page.mouse.click(50, 50);

  await ionModalDidDismiss.next();
});

test('should click to dismiss sheet modal when backdrop is active', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

  await page.click('#backdrop-active');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();

  await page.mouse.click(50, 50);

  await ionModalDidDismiss.next();
});

test('should click to present another modal when backdrop is inactive', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#backdrop-inactive');

  await ionModalDidPresent.next();

  await page.click('#custom-height-modal');

  await ionModalDidPresent.next();

  const customModal = await page.find('.custom-height');
  expect(customModal).not.toBe(null);
});

test('input should be focusable when backdrop is inactive', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#backdrop-inactive');

  await ionModalDidPresent.next();

  await page.click('#root-input');

  const parentEl = await getActiveElementParent(page);
  expect(parentEl.id).toEqual('root-input');
});

test('input should not be focusable when backdrop is active', async () => {
  const page = await newE2EPage({ url: '/src/components/modal/test/sheet?ionic:_testing=true' });
  const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

  await page.click('#backdrop-active');

  await ionModalDidPresent.next();

  await page.click('#root-input');
  await page.waitForChanges();

  const parentEl = await getActiveElement(page);
  expect(parentEl.tagName).toEqual('ION-BUTTON');
});

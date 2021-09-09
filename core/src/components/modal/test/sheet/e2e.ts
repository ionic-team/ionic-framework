import { newE2EPage } from '@stencil/core/testing';
import { testModal } from '../test.utils';

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

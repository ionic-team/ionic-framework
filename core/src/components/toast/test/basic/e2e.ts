import { newE2EPage } from '@stencil/core/testing';

test('toast: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/toast/test/basic?ionic:_testing=true'
  });

  // Show bottom toast
  let button = await page.find('#showBottomToast');
  await button.click();

  let toast = await page.find('ion-toast');
  await toast.waitForVisible();
  await page.waitFor(250);

  let compare = await page.compareScreenshot(`bottom toast`);
  expect(compare).toMatchScreenshot();

  await toast.callMethod('dismiss');
  await toast.waitForNotVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('dismissed bottom toast');
  expect(compare).toMatchScreenshot();

  toast = await page.find('ion-toast');
  expect(toast).toBeNull();

  // Show middle toast
  button = await page.find('#showMiddleToast');
  await button.click();

  toast = await page.find('ion-toast');
  await toast.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot(`middle toast`);
  expect(compare).toMatchScreenshot();

  await toast.callMethod('dismiss');
  await toast.waitForNotVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('dismissed middle toast');
  expect(compare).toMatchScreenshot();

  toast = await page.find('ion-toast');
  expect(toast).toBeNull();

  // Show top toast
  button = await page.find('#showTopToast');
  await button.click();

  toast = await page.find('ion-toast');
  await toast.waitForVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot(`top toast`);
  expect(compare).toMatchScreenshot();

  await toast.callMethod('dismiss');
  await toast.waitForNotVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('dismissed top toast');
  expect(compare).toMatchScreenshot();

  toast = await page.find('ion-toast');
  expect(toast).toBeNull();
});

import { newE2EPage } from '@stencil/core/testing';

it('toast: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/toast/test/basic?ionic:_testing=true'
  });

  const button = await page.find('#showBottomToast');
  await button.click();

  let toast = await page.find('ion-toast');
  await toast.waitForVisible();
  await page.waitFor(250);

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  await toast.callMethod('dismiss');
  await toast.waitForNotVisible();
  await page.waitFor(250);

  compare = await page.compareScreenshot('dismissed');
  expect(compare).toMatchScreenshot();

  toast = await page.find('ion-toast');
  expect(toast).toBeNull();
});

import { newE2EPage } from '@stencil/core/testing';

it('toast: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/toast/test/basic?ionic:_testing=true'
  });

  console.log(1);

  const button = await page.find('#showBottomToast');
  await button.click();

  console.log(2);

  let toast = await page.find('ion-toast');
  await toast.waitForVisible();

  console.log(3);

  let compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  console.log(4);

  await toast.callMethod('dismiss');
  await toast.waitForNotVisible();

  console.log(5);

  compare = await page.compareScreenshot('dismissed');
  expect(compare).toMatchScreenshot();

  console.log(6);

  toast = await page.find('ion-toast');
  expect(toast).toBeNull();

  console.log(7);
});

import { newE2EPage } from '@stencil/core/testing';

it('toast: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/toast/test/standalone?ionic:_testing=true'
  });

  const button = await page.find('#basic');
  await button.click();

  const toast = await page.find('ion-toast');
  await toast.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

});

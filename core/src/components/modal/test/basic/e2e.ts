import { newE2EPage } from '@stencil/core/testing';

test('modal: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/modal/test/basic?ionic:_testing=true'
  });

  await page.click('.e2ePresentModal');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

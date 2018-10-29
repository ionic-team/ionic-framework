import { newE2EPage } from '@stencil/core/testing';

test('modal: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/modal/test/standalone?ionic:_testing=true'
  });

  await page.click('#basic');

  const modal = await page.find('ion-modal');
  await modal.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

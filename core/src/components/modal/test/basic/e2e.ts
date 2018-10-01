import { newE2EPage } from '@stencil/core/testing';

it('modal: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/modal/test/basic?ionic:animated=false'
  });

  await page.click('.e2ePresentModal');
  const popover = await page.find('ion-modal');
  expect(popover).not.toBeNull();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

import { newE2EPage } from '@stencil/core/testing';

it('modal: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/modal/test/standalone?ionic:animated=false'
  });

  await page.click('#basic');
  const popover = await page.find('ion-modal');
  expect(popover).not.toBeNull();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

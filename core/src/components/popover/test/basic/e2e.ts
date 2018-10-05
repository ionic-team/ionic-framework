import { newE2EPage } from '@stencil/core/testing';

it('popover: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/popover/test/basic?ionic:animated=false'
  });

  await page.click('.e2eShowPopover');
  const popover = await page.find('ion-popover');
  expect(popover).not.toBeNull();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

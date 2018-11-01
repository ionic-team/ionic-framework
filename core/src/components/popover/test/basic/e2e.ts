import { newE2EPage } from '@stencil/core/testing';

test('popover: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/popover/test/basic?ionic:_testing=true'
  });

  await page.click('.e2eShowPopover');
  const popover = await page.find('ion-popover');
  await popover.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

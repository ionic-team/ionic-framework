import { newE2EPage } from '@stencil/core/testing';

it('popover: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/popover/test/standalone?ionic:_testing=true'
  });

  await page.click('#basic');
  const popover = await page.find('ion-popover');
  expect(popover).not.toBeNull();

  await popover.waitForVisible();
  await page.waitFor(500);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

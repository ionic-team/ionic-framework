import { newE2EPage } from '@stencil/core/testing';

it('popover: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/popover/test/standalone?ionic:animated=false'
  });

  await page.click('#basic');
  const popover = await page.find('ion-popover');
  expect(popover).not.toBeNull();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

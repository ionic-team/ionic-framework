import { newE2EPage } from '@stencil/core/testing';

it('popover: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/popover/test/standalone?ionic:_testing=true'
  });

  await page.click('#basic');
  await page.waitForSelector('ion-popover.hydrated');

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

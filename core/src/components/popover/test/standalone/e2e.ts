import { newE2EPage } from '@stencil/core/testing';

it('popover: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/popover/test/standalone?ionic:_testing=true'
  });

  await page.click('#basic');
  const alert = await page.find('ion-popover');
  await alert.waitForVisible();
  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

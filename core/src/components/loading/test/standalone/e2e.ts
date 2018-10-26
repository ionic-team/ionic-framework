import { newE2EPage } from '@stencil/core/testing';

it('loading: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/loading/test/standalone?ionic:_testing=true'
  });

  await page.click('#basic');
  const loading = await page.find('ion-loading');
  expect(loading).not.toBeNull();

  await loading.waitForVisible();
  await page.waitFor(500);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

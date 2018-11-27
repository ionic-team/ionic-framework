import { newE2EPage } from '@stencil/core/testing';

test('loading: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/loading/test/basic?ionic:_testing=true'
  });

  await page.click('#basic');
  const loading = await page.find('ion-loading');
  await page.waitFor(250);
  await loading.waitForVisible();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

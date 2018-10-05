import { newE2EPage } from '@stencil/core/testing';

it('loading: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/loading/test/basic?ionic:animated=false'
  });

  await page.click('#basic');
  const loading = await page.find('ion-loading');
  expect(loading).not.toBeNull();

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

import { newE2EPage } from '@stencil/core/testing';

test('refresher: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/refresher/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: translucent', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/translucent?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

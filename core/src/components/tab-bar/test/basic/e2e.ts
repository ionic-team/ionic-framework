import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

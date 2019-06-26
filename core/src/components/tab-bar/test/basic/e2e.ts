import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: preview', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/preview?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

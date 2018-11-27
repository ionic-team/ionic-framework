import { newE2EPage } from '@stencil/core/testing';

test('toolbar: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

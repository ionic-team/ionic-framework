import { newE2EPage } from '@stencil/core/testing';

test('thumbnail: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/thumbnail/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

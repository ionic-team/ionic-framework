import { newE2EPage } from '@stencil/core/testing';

test('slides: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/slides/test/basic'
  });

  await page.waitFor(500);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

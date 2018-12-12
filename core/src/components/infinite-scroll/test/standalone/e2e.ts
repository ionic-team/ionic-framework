import { newE2EPage } from '@stencil/core/testing';

test('infinite-scroll: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/infinite-scroll/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

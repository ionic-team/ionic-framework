import { newE2EPage } from '@stencil/core/testing';

test('infinite-scroll: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/infinite-scroll/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

import { newE2EPage } from '@stencil/core/testing';

test('skeleton-text: custom', async () => {
  const page = await newE2EPage({
    url: '/src/components/skeleton-text/test/custom?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

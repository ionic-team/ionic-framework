import { newE2EPage } from '@stencil/core/testing';

test('content: custom', async () => {
  const page = await newE2EPage({
    url: '/src/components/content/test/custom?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

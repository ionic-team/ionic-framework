import { newE2EPage } from '@stencil/core/testing';

test('content: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/content/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

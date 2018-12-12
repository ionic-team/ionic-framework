import { newE2EPage } from '@stencil/core/testing';

test('textarea: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/textarea/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

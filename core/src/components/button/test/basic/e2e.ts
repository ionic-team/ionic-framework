import { newE2EPage } from '@stencil/core/testing';

test('button: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

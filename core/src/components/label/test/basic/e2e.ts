import { newE2EPage } from '@stencil/core/testing';

test('label: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/label/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

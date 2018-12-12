import { newE2EPage } from '@stencil/core/testing';

test('checkbox: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/checkbox/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

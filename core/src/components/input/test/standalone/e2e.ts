import { newE2EPage } from '@stencil/core/testing';

test('input: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/input/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

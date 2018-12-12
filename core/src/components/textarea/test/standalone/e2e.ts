import { newE2EPage } from '@stencil/core/testing';

test('textarea: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/textarea/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

import { newE2EPage } from '@stencil/core/testing';

test('select: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/select/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

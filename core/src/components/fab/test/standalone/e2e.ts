import { newE2EPage } from '@stencil/core/testing';

test('fab: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

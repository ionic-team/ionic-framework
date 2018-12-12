import { newE2EPage } from '@stencil/core/testing';

test('chip: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/chip/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

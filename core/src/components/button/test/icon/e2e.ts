import { newE2EPage } from '@stencil/core/testing';

test('button: icon', async () => {
  const page = await newE2EPage({
    url: '/src/components/button/test/icon'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

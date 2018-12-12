import { newE2EPage } from '@stencil/core/testing';

test('menu-button: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/menu-button/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

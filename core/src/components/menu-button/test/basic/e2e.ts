import { newE2EPage } from '@stencil/core/testing';

test('menu-button: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/menu-button/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

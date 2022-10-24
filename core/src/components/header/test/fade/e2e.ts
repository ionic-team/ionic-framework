import { newE2EPage } from '@stencil/core/testing';

test('header: fade', async () => {
  const page = await newE2EPage({
    url: '/src/components/header/test/fade?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

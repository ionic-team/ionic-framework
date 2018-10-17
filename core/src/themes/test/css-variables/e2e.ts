import { newE2EPage } from '@stencil/core/testing';

it('badge: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/themes/test/css-variables?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

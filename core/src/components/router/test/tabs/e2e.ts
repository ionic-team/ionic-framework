import { newE2EPage } from '@stencil/core/testing';

test('router: tabs', async () => {
  const page = await newE2EPage({
    url: '/src/components/router/test/tabs?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

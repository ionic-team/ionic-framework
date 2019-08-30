import { newE2EPage } from '@stencil/core/testing';

test('card-header: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/card-header/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

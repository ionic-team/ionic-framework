import { newE2EPage } from '@stencil/core/testing';

test('fab: translucent', async () => {
  const page = await newE2EPage({
    url: '/src/components/fab/test/translucent?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

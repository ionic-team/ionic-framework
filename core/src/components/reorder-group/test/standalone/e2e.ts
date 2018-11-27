import { newE2EPage } from '@stencil/core/testing';

test('reorder: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/reorder-group/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

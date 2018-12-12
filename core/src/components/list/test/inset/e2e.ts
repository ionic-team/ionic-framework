import { newE2EPage } from '@stencil/core/testing';

test('list: inset', async () => {
  const page = await newE2EPage({
    url: '/src/components/list/test/inset'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

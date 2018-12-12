import { newE2EPage } from '@stencil/core/testing';

test('split-pane: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/split-pane/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
